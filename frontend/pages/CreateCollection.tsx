import { LaunchpadHeader } from "@/components/LaunchpadHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MODULE_ADDRESS } from "@/constants";
import { aptosClient } from "@/utils/aptosClient";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { InputViewFunctionData } from "@aptos-labs/ts-sdk";
import { isMobile, useWallet } from "@aptos-labs/wallet-adapter-react";
import { DatePicker, Divider, Form, message, Tag, Typography } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
const { Title, Paragraph } = Typography;
export function CreateCollection() {
  const { account, signAndSubmitTransaction } = useWallet();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [jobsCreatedBy, setJobsCreatedBy] = useState<Job[]>([]);
  const [jobID, setJobID] = useState(0);

  interface Job {
    job_id: number;
    client: string;
    freelancer: string;
    description: string;
    payment_amount: number;
    is_completed: boolean;
    is_freelancer_assigned: boolean;
    is_accepted: boolean;
    job_deadline: number;
  }

  useEffect(() => {
    fetchAllJobs();
    fetchAllJobsCreatedBy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  const disabledDateTime = () => {
    const now = moment();
    return {
      disabledHours: () => [...Array(24).keys()].slice(0, now.hour()),
      disabledMinutes: (selectedHour: number) => {
        if (selectedHour === now.hour()) {
          return [...Array(60).keys()].slice(0, now.minute());
        }
        return [];
      },
      disabledSeconds: (selectedHour: number, selectedMinute: number) => {
        if (selectedHour === now.hour() && selectedMinute === now.minute()) {
          return [...Array(60).keys()].slice(0, now.second());
        }
        return [];
      },
    };
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const disabledDate = (current: any) => {
    return current && current < moment().endOf("day");
  };

  const handleCreateJob = async (values: Job) => {
    try {
      const jobId = jobID + 1000;
      const datePicker = values.job_deadline.toString();

      const timestamp = Date.parse(datePicker);
      const nJob_deadline = timestamp / 1000;

      const transaction = await signAndSubmitTransaction({
        sender: account?.address,
        data: {
          function: `${MODULE_ADDRESS}::FreelanceMarketplace::post_job`,
          functionArguments: [jobId, values.description, values.payment_amount, nJob_deadline],
        },
      });

      await aptosClient().waitForTransaction({ transactionHash: transaction.hash });
      message.success("Job is created!");
      fetchAllJobs();
    } catch (error) {
      if (typeof error === "object" && error !== null && "code" in error && (error as { code: number }).code === 4001) {
        message.error("Transaction rejected by user.");
      } else {
        if (error instanceof Error) {
          console.error(`Transaction failed: ${error.message}`);
        } else {
          console.error("Transaction failed: Unknown error");
        }
        console.error("Transaction Error:", error);
      }
      console.log("Error creating Job.", error);
    }
  };

  const fetchAllJobs = async () => {
    try {
      const payload: InputViewFunctionData = {
        function: `${MODULE_ADDRESS}::FreelanceMarketplace::view_all_jobs`,
      };

      const result = await aptosClient().view({ payload });

      if (result[0]) {
        if (Array.isArray(result[0])) {
          setJobID(result[0].length);
        } else {
          setJobID(0);
        }
      } else {
        setJobID(0);
      }

      const JobList = result[0];

      if (Array.isArray(JobList)) {
        setJobs(JobList);
      } else {
        setJobs([]);
      }
      console.log(jobs);
    } catch (error) {
      console.error("Failed to fetch Jobs:", error);
    }
  };

  const fetchAllJobsCreatedBy = async () => {
    try {
      const WalletAddr = account?.address;
      console.log(WalletAddr);
      const payload: InputViewFunctionData = {
        function: `${MODULE_ADDRESS}::FreelanceMarketplace::view_jobs_by_client`,
        functionArguments: [WalletAddr],
      };

      const result = await aptosClient().view({ payload });

      const jobList = result[0];

      if (Array.isArray(jobList)) {
        setJobsCreatedBy(
          jobList.map((job: unknown) => ({
            job_id: (job as Job).job_id,
            client: (job as Job).client,
            freelancer: (job as Job).freelancer,
            description: (job as Job).description,
            payment_amount: (job as Job).payment_amount,
            is_completed: (job as Job).is_completed,
            is_freelancer_assigned: (job as Job).is_freelancer_assigned,
            is_accepted: (job as Job).is_accepted,
            job_deadline: (job as Job).job_deadline,
          })),
        );
      } else {
        setJobsCreatedBy([]);
      }
      console.log(jobsCreatedBy);
    } catch (error) {
      console.error("Failed to fetch Jobs by address:", error);
    }
  };

  return (
    <>
      <LaunchpadHeader title="Create Job" />
      <div className="flex flex-col md:flex-row items-start justify-between px-4 py-2 gap-4 max-w-screen-xl mx-auto">
        <div className="w-full md:w-2/3 flex flex-col gap-y-4 order-2 md:order-1">
          <Card>
            <CardHeader>
              <CardDescription>Create Job</CardDescription>
            </CardHeader>
            <CardContent>
              <Form
                onFinish={handleCreateJob}
                labelCol={{
                  span: 3,
                }}
                wrapperCol={{
                  span: 100,
                }}
                layout="horizontal"
                style={{
                  maxWidth: 1000,
                  border: "1px solid #e5e7eb",
                  borderRadius: "0.5rem",
                  padding: "1.7rem",
                }}
              >
                <Form.Item label="Description" name="description" rules={[{ required: true }]}>
                  <Input placeholder="Enter Job Description" />
                </Form.Item>
                <Form.Item label="Payment Amount" name="payment_amount" rules={[{ required: true }]}>
                  <Input placeholder="Enter Your Amount" />
                </Form.Item>

                <Form.Item name="job_deadline" label="Job Deadline" rules={[{ required: true }]}>
                  <DatePicker
                    showTime={isMobile() ? false : true}
                    disabledDate={disabledDate}
                    disabledTime={disabledDateTime}
                    getPopupContainer={(trigger) => trigger.parentElement || document.body}
                    popupClassName="max-w-full sm:max-w-lg"
                    className="w-full"
                  />
                </Form.Item>
                <Form.Item>
                  <Button variant="submit" size="lg" className="text-base w-full" type="submit">
                    Create Job
                  </Button>
                </Form.Item>
              </Form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>Get Jobs Created By You</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-2">
                {jobsCreatedBy.map((job, index) => (
                  <Card key={index} className="mb-6 shadow-lg p-4">
                    {/* <h4 className="text-xl font-bold mb-2">{job.description}</h4> */}
                    {/* <p className="text-sm text-gray-500 mb-4">Job ID: {job.job_id}</p> */}
                    <Card style={{ marginTop: 16, padding: 16 }}>
                      {job && (
                        <div>
                          <Title level={3}>job ID: {job.job_id}</Title>
                          <Divider />
                          <Paragraph>
                            <strong>Description:</strong> {job.description}
                          </Paragraph>
                          <Paragraph>
                            <strong>Client:</strong> <Tag>{job.client}</Tag>
                          </Paragraph>
                          <Paragraph>
                            <strong>freelancer:</strong> <Tag>{job.freelancer}</Tag>
                          </Paragraph>
                          <Paragraph>
                            <strong>Payment:</strong> <Tag>{job.payment_amount}</Tag>
                          </Paragraph>
                          <Paragraph className="my-2">
                            <strong>Is Accepted:</strong>{" "}
                            {job.is_accepted ? (
                              <Tag color="green">
                                <CheckCircleOutlined /> Yes
                              </Tag>
                            ) : (
                              <Tag color="red">
                                <CloseCircleOutlined /> No
                              </Tag>
                            )}
                          </Paragraph>
                          <Paragraph className="my-2">
                            <strong>Is Completed:</strong>{" "}
                            {job.is_completed ? (
                              <Tag color="green">
                                <CheckCircleOutlined /> Yes
                              </Tag>
                            ) : (
                              <Tag color="red">
                                <CloseCircleOutlined /> No
                              </Tag>
                            )}
                          </Paragraph>
                          <Paragraph className="my-2">
                            <strong>Is Freelancer Assigned:</strong>{" "}
                            {job.is_freelancer_assigned ? (
                              <Tag color="green">
                                <CheckCircleOutlined /> Yes
                              </Tag>
                            ) : (
                              <Tag color="red">
                                <CloseCircleOutlined /> No
                              </Tag>
                            )}
                          </Paragraph>
                          <Paragraph>
                            <strong>End Time:</strong> {new Date(job.job_deadline * 1000).toLocaleString()}
                          </Paragraph>
                        </div>
                      )}
                    </Card>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="w-full md:w-1/3 order-1 md:order-2">
          <Card>
            <CardHeader className="body-md-semibold">Learn More</CardHeader>
            <CardContent>
              <Link
                to="https://github.com/kunaldhongade/aptos-freelance-platform"
                className="body-sm underline"
                target="_blank"
              >
                Find out more about the Platform
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
