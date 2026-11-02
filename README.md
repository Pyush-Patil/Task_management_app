# Personal Task Manager

A full-stack task management application built with MongoDB, Express.js, React, and Node.js.

## Features

- Create tasks with a title, description, priority, and optional due date.
- View all tasks.
- Update task status (`todo`, `in_progress`, or `done`).
- Delete tasks.
- Filter tasks by status.
- Sort tasks by due date or priority through the backend API.
- Validate request fields and handle API errors.

## Tech Stack

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose

**Frontend**
- React
- Vite
- Axios
- CSS

## Project Structure

```text
Task_management_app/
├── backend/
│   ├── controller/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── db.js
│   ├── server.js
│   └── .env.example
├── frontend/
│   └── task_manager/
│       ├── src/
│       ├── package.json
│       └── .env.example
├── NOTES.md
└── README.md
```

## Prerequisites

- Node.js and npm
- MongoDB Atlas account or a locally running MongoDB instance
- Git

## Setup

### 1. Clone the repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd Task_management_app
```

### 2. Configure the backend

```bash
cd backend
npm install
```

Copy the example environment file to `.env`:

**Windows PowerShell**
```powershell
Copy-Item .env.example .env
```

**macOS/Linux**
```bash
cp .env.example .env
```

Set your MongoDB connection string in `backend/.env`. Do not commit this file.

Start the backend:

```bash
npm run dev
```

If the project does not define a `dev` script, use the start command defined in `backend/package.json` (for example, `node server.js`).

The backend uses port `5000` by default if `PORT` is not set. Check `backend/server.js` and `backend/db.js` if your environment variable names differ from the examples.

### 3. Configure the frontend

Open a second terminal:

```bash
cd frontend/task_manager
npm install
```

Copy the example environment file to `.env`:

**Windows PowerShell**
```powershell
Copy-Item .env.example .env
```

**macOS/Linux**
```bash
cp .env.example .env
```

The frontend API URL should point to the running backend. The example uses:

```env
VITE_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

## API Endpoints

Base URL: `http://localhost:5000`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | API health/message route |
| POST | `/tasks` | Create a task |
| GET | `/tasks` | Get tasks; supports filtering and sorting |
| GET | `/tasks/:id` | Get one task |
| PUT | `/tasks/:id` | Update a task |
| DELETE | `/tasks/:id` | Delete a task |

### Filtering and sorting examples

```text
GET /tasks?status=todo
GET /tasks?sortBy=dueDate&order=asc
GET /tasks?sortBy=priority&order=desc
```

Valid status values: `todo`, `in_progress`, `done`.

Valid sort fields: `dueDate`, `priority`.

Valid sort orders: `asc`, `desc`.

## Environment Variables and Secrets

- Keep actual credentials in local `.env` files.
- Do not commit `.env`, database passwords, API keys, or other secrets.
- Use the supplied `.env.example` files as templates.
- If the variable used by `backend/db.js` has a different name from `MONGO_URI`, update `backend/.env.example` and your local `backend/.env` to match the code.

## Assessment Notes

See [`NOTES.md`](./NOTES.md) for the written assessment responses.
