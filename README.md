# Hintro ✨

> Make your next call smarter. Hintro is a premium, real-time analytics dashboard designed to supercharge your meeting productivity, sync calendar events, analyze call performance, and capture rich post-call feedback with advanced AI integrations.

---

## 🌟 Key Features

- **🔒 Mock Authentication**: Supports credential-validated user logins (`shivam@hintro.ai` & `kshitij.saxena@hintro.ai`).
- **📊 KPI Dashboard**: Displays metrics for total sessions, formatted average duration, AI usage, and last activity.
- **🗃️ Call History**: Lists call logs chronologically grouped by date with user avatar stacks.
- **💬 Feedback System**: Interactive feedback modal and a dedicated Feedback History review table.
- **📱 Responsive Layout**: Fully responsive mobile drawer and persistent desktop sidebar utilizing global CSS variables.

---

## 🚀 Tech Stack

- **Frontend Core**: React 18+ (bundled via [Vite](https://vitejs.dev/))
- **Routing**: React Router DOM v6
- **State Management**: React Context API (`AuthContext`) for auth, profile, and feedback logs
- **Styling**: Modern, responsive Vanilla CSS with dynamic custom properties (variables)
- **Icons**: [Lucide React](https://lucide.dev/) for crisp, responsive vectors

---

## 📐 Conventions & Assumptions

To ensure a highly modular and scalable architecture, the following conventions and assumptions were strictly adhered to:

### 1. Conventions

- **Global Theming**: All CSS relies exclusively on a global CSS variable system (`global.css`) ensuring 0 hardcoded HEX or RGB colors across the application files. This guarantees 100% theme consistency and extremely easy dark-mode integration in the future.
- **Component Modularity**: Components like the `Sidebar` and `FeedbackModal` are fully decoupled. State interactions happen securely via the Context API.
- **Strict File Structure**: Styles are maintained separately from components (`src/styles/*.css`) to maintain clean JSX syntax without bloated inline or CSS-in-JS complexities.

### 2. Assumptions

- **Mock Server Execution**: The frontend application assumes no live external backend is connected. Instead, all data telemetry (Dashboards, Logs, Profile metrics) is reliably processed via the `api.js` local mocked middleware.
- **Authentication**: Authentication is simplified strictly for evaluation purposes. It is assumed the examiner will use the provided auto-fill shortcuts or the designated `password123` credentials for testing.
- **Responsiveness Context**: The application is tailored to provide a mobile-first sidebar drawer and a distinct desktop persistent sidebar approach.

---

## 📦 Quick Start Guide

Get the project up and running locally in under a minute:

### 1. Navigate to the App Folder

```bash
cd hintro
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run the Development Server

```bash
npm run dev
```

Open **[http://localhost:5173](http://localhost:5173)** in your browser.

### 4. Build for Production

```bash
npm run build
```

---

## 👥 Mock Evaluation Users

To make evaluation completely seamless, the login screen includes auto-fill credentials for two distinct environments:

| Profile              | Email                      | Password      | Environment State                                                                                                                                |
| :------------------- | :------------------------- | :------------ | :----------------------------------------------------------------------------------------------------------------------------------------------- |
| **User 1 (Shivam)**  | `shivam@hintro.ai`         | `password123` | **Empty State Demo**: Displays elegant empty states, 0 metrics, calendar integration prompt, and an empty feedback grid to test new submissions. |
| **User 2 (Kshitij)** | `kshitij.saxena@hintro.ai` | `password123` | **Active State Demo**: Loaded with historical sessions grouped by date, custom high-volume metrics, and multiple prior feedback logs.            |

> ⚠️ Only the above credentials are valid. Any other email/password combination will show an error.

---

## 🛠️ Project Structure

```
Hintro_Assignment/
├── hintro/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.jsx
│   │   │   └── FeedbackModal.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── FeedbackHistory.jsx
│   │   ├── styles/
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── README.md
├── package.json
└── package-lock.json
```
