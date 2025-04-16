# Task Management Application

A full-stack task management application with user authentication, built using modern web technologies.

## Features

- User registration and authentication
- JWT-based secure API access
- Create, read, update, and delete tasks
- Task status management (pending/completed)
- Responsive UI with modern design

---

## Tech Stack

- **Backend**: Node.js (v14+), Express.js, TypeScript, Prisma ORM
- **Frontend**: Vite + React
- **Database**: PostgreSQL
- **Authentication**: JWT
- **Version Control**: Git

---

## Tools & Requirements

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) (v6 or higher)
- [PostgreSQL](https://www.postgresql.org/)
- [Git](https://git-scm.com/)
- Web browser (Chrome, Firefox, etc.)

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/ezio-7/task-management-app.git
cd task-management-app
```
### 2. Backend Setup

#### Install Dependencies

```bash
cd backend
npm install
```

#### Configure Environment Variables

Create a .env file in the backend directory:

```env
DATABASE_URL="postgresql://<username>:<password>@localhost:5432/taskmanagement?schema=public"
JWT_SECRET="your-secret-key-here"
PORT=5000
```

Replace <username> and <password> with your actual PostgreSQL credentials.

#### Set Up the Database

Make sure PostgreSQL is running, then run:

```bash
npx prisma migrate dev --name init
```

#### Build the Backend
```bash
npm run build
```

### 3. Frontend Setup

#### Install Dependencies

```bash
cd ../frontend
npm install
```

Configure API URL (Optional)
If your backend runs on a different URL than http://localhost:5000, update the API base URL in:

src/services/authService.ts

src/services/taskService.ts


### 4.Running the Application

#### Start Backend Server

```bash
cd backend
npm start
```

Runs on: http://localhost:5000

#### Start Frontend Dev Server

```bash
cd ../frontend
npm run dev
```

Runs on: http://localhost:5173


### 5. Usage

Open http://localhost:5173

Register a new account or login with existing credentials

Create, edit, and manage your tasks

Toggle task status as pending/completed

Logout when done

### 6.Troubleshooting
Database Issues: Verify your PostgreSQL credentials and ensure the server is running

Backend Errors: Check the terminal output

Frontend Errors: Check browser console (F12)

