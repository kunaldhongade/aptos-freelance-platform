/* eslint-disable react-hooks/exhaustive-deps */
import { LaunchpadHeader } from "@/components/LaunchpadHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MODULE_ADDRESS } from "@/constants";
import { aptosClient } from "@/utils/aptosClient";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { InputViewFunctionData } from "@aptos-labs/ts-sdk";
import { isMobile, useWallet } from "@aptos-labs/wallet-adapter-react";
import { DatePicker, Form, message, Tag, Typography } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
const { Paragraph } = Typography;

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
    is_paid: boolean;
    is_freelancer_assigned: boolean;
    is_accepted: boolean;
    job_deadline: number;
  }

  const convertAmountFromHumanReadableToOnChain = (value: number, decimal: number) => {
    return value * Math.pow(10, decimal);
  };

  const convertAmountFromOnChainToHumanReadable = (value: number, decimal: number) => {
    return value / Math.pow(10, decimal);
  };

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

      const paymentAMT = convertAmountFromHumanReadableToOnChain(values.payment_amount, 8);

      const transaction = await signAndSubmitTransaction({
        sender: account?.address,
        data: {
          function: `${MODULE_ADDRESS}::FreelanceMarketplace::post_job`,
          functionArguments: [jobId, values.description, paymentAMT, nJob_deadline],
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

  const handlePayFreelancer = async (values: Job) => {
    try {
      const transaction = await signAndSubmitTransaction({
        sender: account?.address,
        data: {
          function: `${MODULE_ADDRESS}::FreelanceMarketplace::pay_freelancer`,
          functionArguments: [values.job_id],
        },
      });

      await aptosClient().waitForTransaction({ transactionHash: transaction.hash });
      message.success("Payment is Successful!");
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
      console.log("Error Paying Freelancer.", error);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
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
    } catch (error) {
      console.error("Failed to fetch Jobs:", error);
    }
  };

  const fetchAllJobsCreatedBy = async () => {
    try {
      const WalletAddr = account?.address;
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
            is_paid: (job as Job).is_paid,
            is_freelancer_assigned: (job as Job).is_freelancer_assigned,
            is_accepted: (job as Job).is_accepted,
            job_deadline: (job as Job).job_deadline,
          })),
        );
      } else {
        setJobsCreatedBy([]);
      }
    } catch (error) {
      console.error("Failed to fetch Jobs by address:", error);
    }
  };

  useEffect(() => {
    fetchAllJobs();
    fetchAllJobsCreatedBy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, jobsCreatedBy, jobs, fetchAllJobs]);

  return (
    <>
      <LaunchpadHeader title="Create Job" />
      <div className="flex flex-col items-center justify-center px-4 py-2 gap-4 max-w-screen-xl mx-auto">
        <div className="w-full flex flex-col gap-y-4">
          <Card>
            <CardHeader>
              <CardDescription>Create Job</CardDescription>
            </CardHeader>
            <CardContent>
              <Form
                onFinish={handleCreateJob}
                labelCol={{
                  span: 4.04,
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
              <CardDescription>Pay Freelancer</CardDescription>
            </CardHeader>
            <CardContent>
              <Form
                onFinish={handlePayFreelancer}
                labelCol={{
                  span: 4.04,
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
                <Form.Item label="Job Id" name="job_id" rules={[{ required: true }]}>
                  <Input placeholder="Enter Job Id" />
                </Form.Item>

                <Form.Item>
                  <Button variant="submit" size="lg" className="text-base w-full" type="submit">
                    Pay Freelancer
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
                    <p className="text-sm text-gray-500 mb-4">Job ID: {job.job_id}</p>
                    <Card style={{ marginTop: 16, padding: 16 }}>
                      {job && (
                        <div>
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
                            <strong>Payment:</strong>{" "}
                            <Tag>{convertAmountFromOnChainToHumanReadable(job.payment_amount, 8)}</Tag>
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
                            <strong>Is Paid:</strong>{" "}
                            {job.is_paid ? (
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
                          {job.is_completed && !job.is_paid && (
                            <Button
                              onClick={() => handlePayFreelancer(job)}
                              variant="submit"
                              size="lg"
                              className="text-base w-full"
                            >
                              Pay Freelancer
                            </Button>
                          )}
                        </div>
                      )}
                    </Card>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
