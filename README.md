# Freelance Job Marketplace - Frontend

This is the frontend for the **Freelance Job Marketplace**, where clients can post jobs, and freelancers can apply, accept, and complete tasks, all while managing payments securely on the Aptos blockchain.

## Key Features

- **Job Management**: Post new jobs, view job details, and see job status (accepted, completed, etc.).
- **Freelancer Interaction**: Freelancers can view available jobs, accept tasks, and get paid in APT (Aptos native coin).
- **Blockchain-Powered**: Payments and job statuses are managed securely using smart contracts on the Aptos blockchain.

## Prerequisites

Before running the project, ensure you have the following installed:

- **Node.js**: v16 or above
- **npm**: v7 or above (comes with Node.js)
- **Aptos Wallet** (such as Petra)

## Setup Instructions

1. **Clone the Project**

   First, move to the folder to your local machine:

   ```bash
   cd Freelance-platform
   ```

2. **Install Dependencies**

   Run the following command to install all necessary packages:

   ```bash
   npm install
   ```

3. **Configure Environment Variables**

   Create a `.env` file in the root of the project and configure the following environment variables:

   ```bash
   VITE_MODULE_ADDRESS=0xaf12ecd9cf6578db88443a384a2d028e67ecda31cf0f441072d22201da3c0072
   VITE_APP_NETWORK=testnet
   ```

4. **Start the Project**

   Start the project in development mode with:

   ```bash
   npm run dev
   ```

   The app will run at [http://localhost:5173/](http://localhost:5173/).

## Usage Guide

1. **Connect Wallet**

   - Open the app and click on the "Connect Wallet" button to link your Aptos wallet.
   - The platform supports Aptos wallets such as Petra.

2. **For Clients**

   - **Post a Job**: Use the "Post a Job" button to submit a new job. Enter details such as job description, payment amount (in APT), and deadline.
   - **View Your Jobs**: Navigate to "My Jobs" to view all the jobs you’ve posted, and track their progress.

3. **For Freelancers**

   - **View Jobs**: Browse available jobs posted by clients.
   - **Apply for Jobs**: Select a job that suits you and click "Apply for Job" to accept it.
   - **Mark Job as Completed**: Once you’ve finished the task, click "Complete Job" to notify the client.
   - **Receive Payment**: After job completion, payment will be made in APT based on the contract agreement.

4. **Job Management**
   - Jobs will display their status: assigned to a freelancer, completed, or awaiting action.
   - Clients can see if jobs are accepted or completed, and freelancers will only see jobs where no freelancer has been assigned.
