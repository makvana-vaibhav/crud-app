# Three-tier User Manager

A simple three-tier practice app with a React frontend, Node/Express API, and PostgreSQL database.

## Features
- Add users
- Edit user names
- Delete users
- View the full user list
- Clean dashboard UI for demo and DevOps practice

## Run locally
1. Start PostgreSQL and make sure the database configured in the backend exists.
2. Install dependencies in `backend/` and `frontend/`.
3. Run the backend on port `3000`.
4. Run the frontend on port `5173`.

## Database table
The backend creates this table automatically on startup if it does not already exist.

```sql
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);
```
