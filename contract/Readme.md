# Freelance Job Marketplace - Smart Contract

This repository contains the **Freelance Job Marketplace** smart contract developed on the **Aptos Blockchain**. The smart contract facilitates job posting, job acceptance, task completion, and payments between clients and freelancers using the Aptos native token, **APT**.

## Key Features

- **Job Posting**: Clients can post jobs with specific descriptions, deadlines, and payment amounts.
- **Freelancer Interaction**: Freelancers can view available jobs, accept them, and mark jobs as completed.
- **Secure Payments**: Payments are automatically handled by the contract once the job is completed, and they are done in **APT** (Aptos native coin).
- **Decentralized**: The entire platform runs on smart contracts, ensuring transparency and trust for both clients and freelancers.

## Prerequisites

Before interacting with the contract, ensure you have the following:

- **Aptos CLI** installed (for deploying and interacting with the contract)
- **Aptos Account** with test funds on **Devnet** (or Mainnet, if live)

## Setup Instructions

1. **Clone the Repository**

   move to the smart contract folder to your local machine:

   ```bash
   cd contract
   ```

2. **Install Aptos CLI**

   Install the Aptos CLI by following the official [Aptos CLI installation guide](https://aptos.dev/cli-tools/aptos-cli-tool/install-aptos-cli).

3. **Configure the Aptos Network**

   Configure the Aptos network by running:

   ```bash
   aptos init
   ```

   Choose the appropriate network (`devnet`, `testnet`, or `mainnet`) and set up your account.

4. **Compile the Contract**

   Compile the contract to the Aptos network using:

   ```bash
   aptos move compile
   ```

5. **Deploy the Contract**

   Deploy the contract to the Aptos network using:

   ```bash
   aptos move publish
   ```

   This will deploy the smart contract to your Aptos account on the selected network.

## Smart Contract Functions

### 1. **initialize_platform**

Initializes the platform by setting up the job holder and freelancer registry.

```move
public entry fun initialize_platform(admin: &signer)
```

### 2. **register_freelancer**

Allows a freelancer to register on the platform.

```move
public entry fun register_freelancer(freelancer: &signer)
```

### 3. **post_job**

Clients can post new jobs, providing job details such as description, payment amount, and deadline.

```move
public entry fun post_job(
    client: &signer,
    job_id: u64,
    description: String,
    payment_amount: u64,
    job_deadline: u64
)
```

### 4. **accept_job**

Freelancers can accept a job by its job ID.

```move
public entry fun accept_job(
    freelancer: &signer,
    job_id: u64
)
```

### 5. **complete_job**

Freelancers mark a job as completed once the task is done.

```move
public entry fun complete_job(
    freelancer: &signer,
    job_id: u64
)
```

### 6. **pay_freelancer**

Clients pay freelancers after the job is marked as completed. Payment is in **APT**.

```move
public entry fun pay_freelancer(
    client: &signer,
    job_id: u64,
    payment_amount: u64
)
```

### 7. **view_all_jobs**

Fetches all the jobs posted on the platform.

```move
#[view]
public fun view_all_jobs(): vector<Job>
```

### 8. **view_job_by_id**

Fetches details of a specific job using its job ID.

```move
#[view]
public fun view_job_by_id(job_id: u64): Job
```

### 9. **view_jobs_by_client**

Fetches all jobs posted by a specific client.

```move
#[view]
public fun view_jobs_by_client(client: address): vector<Job>
```

### 10. **view_jobs_by_freelancer**

Fetches all jobs accepted by a freelancer.

```move
#[view]
public fun view_jobs_by_freelancer(freelancer: address): vector<Job>
```

## Security

- Ensure that the contract owner is the only entity able to initialize the platform.
- Freelancers must be registered before they can accept jobs.
- Payments are only made after job completion is verified, ensuring fair transactions.

## Conclusion

This smart contract allows for seamless job management and payment solutions between clients and freelancers. It ensures trust and transparency, thanks to the immutable nature of the Aptos blockchain.

If you have any questions about how to interact with the contract or need further assistance, feel free to reach out!
