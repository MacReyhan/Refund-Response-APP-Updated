# Refund Response Generator

A powerful tool designed for customer support agents to generate standardized, accurate, and empathetic refund responses for Flipkart customers.

## 🔗 Live Application
**Access the tool here:** [https://refund-response-app.web.app/](https://refund-response-app.web.app/)

## 🚀 About the Application

The **Refund Response Generator** streamlines the workflow for support agents by automating the creation of refund status messages. Instead of manually typing out each response, agents can simply input the refund details, and the application generates a perfectly formatted message tailored to the specific refund mode and status.

### Key Features:

*   **Smart Auto-Detection**: Simply paste the raw refund details (e.g., "Amount (Rs) 953... Mode Credit Card"), and the app automatically fills in the Amount, RRN, Mode, and SLA Date.
*   **Dynamic SLA Handling**:
    *   Automatically calculates if a refund is "Within SLA" or "Post SLA".
    *   Formats dates intelligently (e.g., "by 28 Dec" vs "within 2-4 hours").
    *   Auto-switches status to **Completed (Post SLA)** if the current time has passed the SLA deadline.
*   **Comprehensive Mode Support**:
    *   **Bank & Cards**: Credit Card, Credit Card EMI, Debit Card, NetBanking, NEFT, IMPS.
    *   **UPI**: Unified Payment Interface, Flipkart UPI.
    *   **Wallets & Others**: Gift Cards, SuperCoins.
*   **Response Breakdown**: Generated messages are broken down line-by-line for easy reading and copying.
*   **Sidebar Snippets**: Quick access to common phrases (e.g., "SMS sent", "Evening Mode" greetings) and SMS templates.
*   **Dark Mode**: A built-in dark theme for comfortable usage during long shifts.

## 🛠️ How it Works

1.  **Input Details**: Enter the Refund Amount, Reference Number (RRN), and Dates manually, or use the **Chat Widget** to paste raw text for auto-extraction.
2.  **Select Context**: Choose the **Refund Mode** (e.g., UPI, Credit Card) and the **Status** (Processing, Completed - Within SLA, Completed - Post SLA).
3.  **Generate**: Click "Generate Response" to create the customer-facing message.
4.  **Copy & Send**: Click on individual lines or the "Copy Full" button to grab the text and send it to the customer.

## 💻 Running Locally

To run this project on your local machine:

1.  **Clone the repository**
2.  **Install dependencies**:
    ```bash
    npm install
    # or
    pnpm install
    ```
3.  **Start the development server**:
    ```bash
    npm run dev
    ```
