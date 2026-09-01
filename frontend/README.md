# Store Rating Frontend

A responsive React frontend for a store rating and management platform with role-based dashboards for admins, users, and store owners.

## Overview

This application is built with Vite and React and provides a clean dashboard experience for:

- Admin users managing people and stores
- Regular users browsing stores and submitting ratings
- Store owners monitoring store ratings and customer feedback

## Main Features

- Responsive navigation and dashboard layouts
- Role-based protected routes
- Search and filtering for users and stores
- Statistics cards and rating summaries
- Mobile-friendly form and table layouts
- Clean and consistent UI styling across the app

## Tech Stack

- React 19
- Vite
- React Router DOM
- Axios
- Custom CSS styling

## Project Structure

```text
frontend/
├── public/
├── src/
│   ├── api/
│   ├── components/
│   ├── context/
│   ├── pages/
│   ├── routes/
│   ├── styles/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Role-Based Pages

- `/login` – login page
- `/signup` – user registration page
- `/admin` – admin dashboard and management screens
- `/user` – user dashboard for store browsing and rating
- `/owner` – owner dashboard for store performance overview

## Setup

### Install dependencies

```bash
cd frontend
npm install
```

### Run in development mode

```bash
npm run dev
```

The app will run at:

```text
http://localhost:5173
```

## Build for Production

```bash
npm run build
```

## Notes

- The frontend is designed to keep the original app structure while improving responsiveness, consistency, and professionalism.
- Authentication state is managed through the auth context and protected routes.
- Styling is tuned to preserve the current visual identity while fixing browser-default rendering issues and improving mobile usability.

## Default Admin Login

```text
Email: admin@gmail.com
Password: Admin@123
```
