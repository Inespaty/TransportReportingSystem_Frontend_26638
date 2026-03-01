# Transport Reporting System - Frontend

A modern, high-performance web interface built with React 19 and Vite, providing a seamless user experience for transportation management and reporting.

## Problem Statement

The public transport sector often lacks a structured, transparent, and anonymous way for stakeholders to report issues, provide feedback, or manage routes effectively. Traditional methods are often fragmented, prone to bias, or difficult for administrators to triage.

The **Transport Reporting System** solves this by:
- **Centralizing Feedback**: A single platform for all transport-related reports.
- **Ensuring Anonymity**: Protecting reporter identities from company admins to prevent retaliation or biased handling.
- **Improving Triage**: Providing administrators with robust tools to track, update, and resolve reported issues.
- **Strategic Oversight**: Giving Super Admins a global view of transport health across multiple companies and locations.

##  Core Technologies

- **React 19**: Next-generation React features for optimized performance.
- **Vite**: Ultra-fast build tool and development server.
- **Tailwind CSS 4**: Modern, utility-first styling for a beautiful and responsive UI.
- **Axios**: Robust HTTP client for API communication with JWT interceptors.
- **Lucide React**: Premium icon set for a clean and professional look.
- **React Router Dom 7**: Advanced client-side routing with protected route support.

##  Key Features

- **Responsive Dashboard**: Real-time business statistics and activity monitoring.
- **Dynamic Data Tables**: Advanced filtering, global search (supporting IDs), and server-side pagination.
- **Global Auth Context**: Centralized authentication state management.
- **Role-Protected Routes**: Automatic redirection based on user permissions.
- **Premium UI/UX**:
  - Clean, modern layout using Tailwind CSS.
  - Interactive sidebar and topbar navigation.
  - Smooth transitions and micro-interactions.
  - Standardized form components for consistent data entry.

##  Project Structure

- **`src/pages/`**: Top-level views (Dashboard, Login, Management Pages).
- **`src/components/`**: Reusable UI atomic components (DataTable, Sidebar, Layout, Buttons).
- **`src/services/`**: API integration layer (`api.js` for base configuration).
- **`src/context/`**: Global state providers (Authentication status and user data).
- **`src/utils/`**: Helper functions and shared logic.

##  Installation & Setup

### Prerequisites
- Node.js 18+ installed.
- npm or yarn installed.

### Setup
1.  Navigate to the `frontend/` directory.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure environment variables (copy `.env.example` to `.env`):
    ```bash
    cp .env.example .env
    ```
4.  Launch the development server:
    ```bash
    npm run dev
    ```

## Design Philosophy

The frontend transitioned from Material-UI (MUI) to **Tailwind CSS 4** to achieve:
1.  **Lower Bundle Size**: Faster initial load times.
2.  **Greater Flexibility**: Highly customizable designs without theme overrides.
3.  **Modern Aesthetics**: Clean, utility-first approach that aligns with current web standards.


