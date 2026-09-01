# Store Rating App

A full-stack application for managing stores, users, and ratings with role-based access for administrators, store owners, and regular users.

## Overview

This project allows:

- Admins to manage users and stores
- Users to search stores and submit ratings
- Owners to view average ratings and customer feedback for their assigned store
- Secure login and protected routes using JWT-based authentication

## Tech Stack

### Frontend
- React 19
- Vite
- React Router DOM
- Axios
- CSS modules and custom component styling

### Backend
- Node.js
- Express.js
- MySQL
- JWT for authentication
- bcrypt for password hashing

## Project Structure

```text
store-rating-app/
├── backend/
│   ├── src/
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
├── README.md
└── .gitignore
```

## Features

### Admin
- Dashboard overview with total users, stores, and ratings
- Create and manage users
- Manage stores
- View user details and store-related information
- Role-based access control

### User
- Search stores by name or address
- Browse available stores
- Submit ratings for stores
- View responsive dashboard experience

### Owner
- View assigned store details
- Check average rating
- Review ratings submitted by users
- See customers who rated the store

## Role-Based Workflow

- Admin login routes to the admin dashboard
- User login routes to the user dashboard
- Owner login routes to the owner dashboard
- All protected pages require a valid JWT token

## Prerequisites

Before running the app, make sure you have installed:

- Node.js (v18 or above)
- MySQL database
- npm

## Environment Setup

Create a `.env` file inside the `backend` folder with the required database and JWT variables.

Example:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=store_rating_db
DB_PORT=3306
JWT_SECRET=your_secure_secret_key
PORT=5000
```

## Database Setup

Create the required MySQL database and import the tables used by the app before starting the backend server.

## Install Dependencies

### Backend

```bash
cd backend
npm install
```

### Frontend

```bash
cd frontend
npm install
```

## Run the Application

### Start Backend

```bash
cd backend
npm run dev
```

The backend server runs on:

```text
http://localhost:5000
```

### Start Frontend

```bash
cd frontend
npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

## Default Admin Account

A seed admin is created for the application:

- Email: admin@gmail.com
- Password: Admin@123

## Build for Production

### Frontend

```bash
cd frontend
npm run build
```

### Backend

```bash
cd backend
npm start
```

## License

This project is for educational and demonstration use.
