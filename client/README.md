
# Job Tracker — Frontend

The frontend of **Job Tracker**, a full-stack web application that helps job seekers manage and track their job and internship applications.

## Tech Stack

- React
- Vite
- Tailwind CSS
- React Router
- Recharts

## Features

- User registration and login
- Protected routes
- Dashboard for tracking applications
- Create, view, update, and delete job applications
- Track application statuses and important dates
- View application statistics
- Manage user profile

## Getting Started

### 1. Navigate to the client folder

```bash
cd client
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file inside the `client` folder:

```env
VITE_API_URL=http://localhost:5000/api
```

For production, set `VITE_API_URL` to your deployed backend API URL in your hosting provider's environment settings.

### 4. Start the development server

```bash
npm run dev
```

Vite will display the local URL in your terminal.

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview the production build |

## Backend

This frontend communicates with the Job Tracker backend through its REST API.

## Live Demo

[Open Job Tracker](https://job-tracker-frontend-26wf.onrender.com)

## Main Repository

[View the Job Tracker repository](https://github.com/prabhatjaidiya/job-tracker)