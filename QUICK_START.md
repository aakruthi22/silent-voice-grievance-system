# Quick Start Guide

## Before Running

1. **Set up MySQL Database:**
   - Make sure MySQL is running
   - Create the database and run the schema:
   ```sql
   CREATE DATABASE grievance_system;
   USE grievance_system;
   ```
   - Then run the SQL file: `database/schema.sql`

2. **Configure Backend .env:**
   - Edit `backend/.env` and set your MySQL password:
   ```
   DB_PASSWORD=your_mysql_password_here
   ```

3. **Initialize Sample Users:**
   ```bash
   cd backend
   node init-db.js
   ```

## Running the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Sample Credentials

- **Admin:** username: `admin`, password: `admin123`
- **Student:** username: `student`, password: `student123`

Or register a new student account from the login page!

