<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 💸 Refund Response App

The **Refund Response App** is a specialized productivity tool designed for customer support engineers and agents. It streamlines the creation of standardized refund communications by automatically generating context-specific messages based on refund modes, transaction statuses, and real-time situational data.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwind-css)

## ✨ Key Features

- **Context-Aware Logic**: Generates distinct responses for over 10 refund modes including UPI, Credit Cards, SuperCoins, and Gift Cards.
- **Smart "Evening Mode"**: Automatically adjusts snippets and greetings based on IST time (post-9 PM logic) to maintain professional empathy during late-shift operations.
- **Line-by-Line Copy**: Beyond full-text generation, agents can copy individual segments of a response for granular chat interactions.
- **SuperCoins Integration**: Dedicated workflow for SuperCoins balance updates with dynamic input fields.
- **Strict Data Integrity**: Input sanitization (alphanumeric stripping for amounts) ensures error-free generation.
- **Modern UX/UI**: 
  - Fully responsive sidebar with quick-access snippets.
  - Ambient design with glassmorphism effects.
  - Native Dark Mode support.
  - Atomic state management for zero-latency resets.

## 🛠️ Tech Stack

- **Core**: React 19 (ES6+ Modules)
- **Styling**: Tailwind CSS (JIT Engine)
- **Icons**: Lucide React
- **Typography**: Inter (Google Fonts)
- **Architecture**: Functional components with custom utility-based business logic separation.

## 🚀 Getting Started

### Prerequisites
- A modern web browser.
- A local development server (like Vite or Live Server) to serve the `index.html`.

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/refund-response-app.git
