# 🚀 Freelance Job Marketplace - Frontend

Welcome to the **Freelance Job Marketplace**, a decentralized platform built on the **Aptos Blockchain**. This marketplace allows **clients** to post jobs and **freelancers** to apply, accept, and complete tasks, all while securely managing payments using smart contracts on Aptos. Enjoy a transparent, secure, and decentralized experience.

---

## 🔗 Links

- **Live Demo**: [Freelance Marketplace](https://aptos-freelance-platform.vercel.app/)
- **Smart Contract Explorer**: [Aptos Explorer](https://explorer.aptoslabs.com/account/0xaf12ecd9cf6578db88443a384a2d028e67ecda31cf0f441072d22201da3c0072/modules/code/FreelanceMarketplace?network=testnet)

---

## ✨ Key Features

- **Job Posting and Management**: Clients can post, view, and manage jobs, tracking their progress and status.
- **Freelancer Interaction**: Freelancers can browse available jobs, accept tasks, mark jobs as completed, and receive payments.
- **Blockchain-Powered Payments**: Payments are managed securely through smart contracts on Aptos, ensuring trust and transparency.
- **Progress Tracking**: Jobs display real-time status updates, such as **assigned**, **in progress**, and **completed**.
- **Wallet Integration**: Easily connect your Aptos wallet (e.g., **Petra Wallet**) to perform all interactions on the blockchain.

---

## 📋 Prerequisites

Ensure the following are installed:

- **Node.js**: v16 or higher
- **npm**: v7 or higher (comes with Node.js)
- **Aptos Wallet** (e.g., **Petra Wallet**) for transactions

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
cd freelance-marketplace
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory with the following:

```bash
VITE_MODULE_ADDRESS=0xaf12ecd9cf6578db88443a384a2d028e67ecda31cf0f441072d22201da3c0072
VITE_APP_NETWORK=testnet
```

Update the **module address** if you deploy the contract to a new address.

### 4. Run the Development Server

```bash
npm run dev
```

The app will be available at [http://localhost:5173](http://localhost:5173).

### 5. Deploy the Smart Contract

To deploy the smart contract:

1.  Install **Aptos CLI**.
2.  Update the **Move.toml** file with your wallet address:

    - Add you Wallet Address from Petra here

    ```bash
    job_addrx = "0xca10b0176c34f9a8315589ff977645e04497814e9753d21f7d7e7c3d83aa7b57"
    ```

    - Add your Account addr here for Deployment

    ```bash
    my_addrx = "af12ecd9cf6578db88443a384a2d028e67ecda31cf0f441072d22201da3c0072"
    ```

3.  Create your new Address for Deployment

    ```bash
    aptos init
    ```

4.  Compile and publish the contract:

    ```bash
    aptos move compile
    aptos move publish
    ```

---

## 🛠 How to Use the Platform

### 1. Connect Wallet

- Click **"Connect Wallet"** to link your Aptos wallet (e.g., Petra).
- This allows you to post jobs, apply for tasks, and receive payments securely on the blockchain.

### 2. For Clients

- **Post a Job**: Enter job details such as description, payment amount (APT), and deadline.
- **View and Track Jobs**: Navigate to the **My Jobs** section to see all jobs posted and track their status.

### 3. For Freelancers

- **Browse Jobs**: View available jobs that haven't been assigned to freelancers.
- **Apply for Jobs**: Choose a suitable job and click **"Apply for Job"** to accept it.
- **Complete Jobs**: Once done, click **"Complete Job"** to notify the client.
- **Receive Payments**: Upon completion, payments will be processed and transferred in APT as per the smart contract.

### 4. Track Job Status

- Job statuses include **available**, **in progress**, and **completed**.
- **Clients** can monitor job progress and see if tasks are accepted or finished.
- **Freelancers** can view jobs they've accepted and track their own progress.

---

## 📊 Scripts

- **`npm run dev`**: Start the development server locally.
- **`npm run build`**: Build the project for production.
- **`npm test`**: Run unit tests (if configured).

---

## 🔍 Dependencies

- **React**: For building the user interface.
- **TypeScript**: For type-safe JavaScript.
- **Aptos SDK**: For blockchain interactions.
- **Ant Design / Tailwind CSS**: For modern UI and responsive design.
- **Petra Wallet Adapter**: For connecting the Aptos wallet.

---

## 📚 Available View Functions

- **View All Jobs**: Displays a list of all available jobs on the platform.
- **View Jobs by Client**: Shows jobs posted by a specific client address.
- **View Jobs by Freelancer**: Displays tasks accepted or completed by a freelancer.
- **View Job by ID**: Provides detailed information about a specific job.

---

## 🛡 Security and Transparency

- **Smart Contracts**: Handle payments and job statuses directly on the blockchain.
- **No Middlemen**: Payments are processed directly between clients and freelancers.
- **Progress Tracking**: Both parties can track job statuses and payments in real-time.

---

## 🌐 Common Issues and Solutions

1. **Wallet Connection Issues**: Ensure the Aptos wallet extension is installed and active.
2. **RPC Rate Limits**: Use private RPC providers like **Alchemy** to avoid limits.
3. **Transaction Errors**: Confirm the wallet has sufficient balance and permissions.

---

## 🚀 Scaling and Deployment

If deploying to **Vercel**, follow these tips to avoid **RPC request limits**:

- Use **third-party RPC providers** (e.g., Alchemy, QuickNode).
- Implement **request throttling** to reduce load.
- Use **WebSockets** for real-time updates on job statuses and payments.

---

## 🎉 Conclusion

The **Freelance Job Marketplace** provides a decentralized way for clients and freelancers to collaborate securely, with payments managed directly on the Aptos blockchain. This transparent and user-friendly platform ensures trust and efficiency, making it easy to post, accept, and complete jobs without intermediaries. Start your journey today!
