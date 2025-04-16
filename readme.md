# Task Management Application

A full-stack task management application with user authentication, built using modern web technologies.

## Features

- User registration and authentication
- JWT-based secure API access
- Create, read, update, and delete tasks
- Task status management (pending/completed)
- Responsive UI with modern design
- unit tets for backend

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

- Open http://localhost:5173
- Register a new account or login with existing credentials
- Create, edit, and manage your tasks
- Toggle task status as pending/completed
- Logout when done

### 6.Unit tests

#### Testing Backend

cd into your backend directory

run 

```bash
npm test
```

### 7.Troubleshooting

- Database Issues: Verify your PostgreSQL credentials and ensure the server is running
- Backend Errors: Check the terminal output
- Frontend Errors: Check browser console (F12)

## API Endpoint Documentation

### Authentication Endpoints

#### Register a New User

- URL: POST /api/auth/register
- Description: Creates a new user account
- Authentication: None
- Request Body:

```JSON

{
  "username": "string",
  "password": "string"
}
```

##### Success Response (201 Created):

```JSON

{
  "status": "success",
  "data": {
    "id": "number",
    "username": "string",
    "token": "string"
  }
}
```

##### Error Responses:
- 400 Bad Request: Username or password missing
- 400 Bad Request: User already exists

#### Login

- URL: POST /api/auth/login
- Description: Authenticates a user and returns a JWT token
- Authentication: None
- Request Body:

```JSON

{
  "username": "string",
  "password": "string"
}
```
##### Success Response (200 OK):

```JSON

{
  "status": "success",
  "data": {
    "id": "number",
    "username": "string",
    "token": "string"
  }
}
```

##### Error Responses:
- 400 Bad Request: Username or password missing
- 401 Unauthorized: Invalid credentials

### Task Endpoints
##### All task endpoints require authentication via JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

#### Get All Tasks

- URL: GET /api/tasks
- Description: Retrieves all tasks for the authenticated user
- Authentication: Required

##### Success Response (200 OK):

```JSON

{
  "status": "success",
  "data": [
    {
      "id": "number",
      "title": "string",
      "description": "string | null",
      "status": "PENDING | COMPLETED",
      "userId": "number",
      "createdAt": "string (ISO date)",
      "updatedAt": "string (ISO date)"
    }
  ]
}
```

##### Error Responses:
- 401 Unauthorized: No token provided or invalid token

#### Create a Task

- URL: POST /api/tasks
- Description: Creates a new task for the authenticated user
- Authentication: Required
- Request Body:

```JSON

{
  "title": "string",
  "description": "string (optional)",
  "status": "PENDING | COMPLETED (optional, defaults to PENDING)"
}
```

##### Success Response (201 Created):

```JSON

{
  "status": "success",
  "data": {
    "id": "number",
    "title": "string",
    "description": "string | null",
    "status": "PENDING | COMPLETED",
    "userId": "number",
    "createdAt": "string (ISO date)",
    "updatedAt": "string (ISO date)"
  }
}
```

##### Error Responses:
- 400 Bad Request: Title is missing
- 401 Unauthorized: No token provided or invalid token

#### Update a Task

- URL: PUT /api/tasks/:id
- Description: Updates an existing task
- Authentication: Required
- URL Parameters: id: Task ID
- Request Body (all fields optional):

```JSON

{
  "title": "string",
  "description": "string",
  "status": "PENDING | COMPLETED"
}
```

##### Success Response (200 OK):

```JSON

{
  "status": "success",
  "data": {
    "id": "number",
    "title": "string",
    "description": "string | null",
    "status": "PENDING | COMPLETED",
    "userId": "number",
    "createdAt": "string (ISO date)",
    "updatedAt": "string (ISO date)"
  }
}
```

##### Error Responses:
- 401 Unauthorized: No token provided or invalid token
- 403 Forbidden: User does not own the task
- 404 Not Found: Task not found

#### Delete a Task

- URL: DELETE /api/tasks/:id
- Description: Deletes a task
- Authentication: Required
- URL Parameters: id: Task ID

##### Success Response (200 OK):

```JSON

{
  "status": "success",
  "message": "Task deleted"
}
```

##### Error Responses:
- 401 Unauthorized: No token provided or invalid token
- 403 Forbidden: User does not own the task
- 404 Not Found: Task not found
  
#### Error Response Format
All API errors follow this format:

```JSON

{
  "status": "error",
  "message": "Error description"
}
```

### Authentication
The API uses JWT (JSON Web Token) for authentication. After registering or logging in, you'll receive a token that should be included in the Authorization header for all protected endpoints:

```
Authorization: Bearer <your_token>
```

Tokens expire after 30 days, after which you'll need to log in again to get a new token.
