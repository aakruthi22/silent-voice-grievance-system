# Quick Setup Guide

## Database Setup Required

Before running the application, you need to:

1. **Create the MySQL database:**
   - Open MySQL command line or MySQL Workbench
   - Run: `CREATE DATABASE grievance_system;`

2. **Run the schema:**
   ```bash
   mysql -u root -p grievance_system < database/schema.sql
   ```
   Or manually execute the SQL in `database/schema.sql`

3. **Configure backend/.env file:**
   Create a file named `.env` in the `backend` directory with:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password_here
   DB_NAME=grievance_system
   PORT=5000
   JWT_SECRET=grievance_system_secret_key_2024
   NODE_ENV=development
   ```
   **Important:** Replace `your_mysql_password_here` with your actual MySQL root password.

4. **Initialize default users:**
   ```bash
   cd backend
   node init-db.js
   ```
   This creates:
   - Admin: `admin` / `admin123`
   - Student: `student` / `student123`

5. **Start the servers:**
   
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

6. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Troubleshooting

- **Database connection error:** Make sure MySQL is running and the password in `.env` is correct
- **Port already in use:** Change the PORT in `.env` or stop the service using that port
- **Module not found:** Run `npm install` in both backend and frontend directories

