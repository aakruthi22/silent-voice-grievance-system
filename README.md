# Anonymous Grievance System

A full-stack web application for managing anonymous grievances, built with React, Node.js, Express, and MySQL.

## Features

- **Student Features:**
  - Register new student account
  - Login to view personal dashboard
  - Submit new grievances (title, description, category)
  - View own grievances with status
  - View admin responses to grievances
  - Grievances are anonymous to other students but visible to admins

- **Admin Features:**
  - Login to admin dashboard
  - View all grievances from all students
  - See submitter identity for each grievance
  - Respond to grievances
  - Update grievance status (pending, in_progress, resolved)
  - Filter grievances by status

## Tech Stack

- **Frontend:** React, React Router, Axios
- **Backend:** Node.js, Express
- **Database:** MySQL
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcryptjs

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd GrievanceSystem
```

### 2. Database Setup

1. Create a MySQL database:
```sql
CREATE DATABASE grievance_system;
```

2. Run the schema file:
```bash
mysql -u root -p grievance_system < database/schema.sql
```

### 3. Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=grievance_system
PORT=5000
JWT_SECRET=your_secret_key_here_change_in_production
NODE_ENV=development
```

4. Initialize sample users:
```bash
node init-db.js
```

This will create:
- Sample Admin: `admin` / `admin123` (email: admin@grievance.com)
- Sample Student: `student` / `student123` (email: student@example.com)

Note: Students can also register new accounts through the registration page.

5. Start the backend server:
```bash
npm start
```

The backend will run on `http://localhost:5000`

### 4. Frontend Setup

1. Open a new terminal and navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory (optional):
```env
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the frontend development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## Usage

1. Open your browser and navigate to `http://localhost:3000`
2. **For Students:**
   - Click "Register as Student" to create a new account
   - Or login with sample credentials: username: `student`, password: `student123`
   - Submit grievances and view your own
3. **For Admins:**
   - Login with sample credentials: username: `admin`, password: `admin123`
   - View all grievances, respond, and update status

## Project Structure

```
GrievanceSystem/
├── backend/
│   ├── config/
│   │   └── database.js          # MySQL connection
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   └── grievanceController.js # Grievance CRUD operations
│   ├── middleware/
│   │   └── auth.js              # JWT authentication middleware
│   ├── models/
│   │   ├── User.js              # User model
│   │   └── Grievance.js         # Grievance model
│   ├── routes/
│   │   ├── auth.js              # Auth routes
│   │   └── grievances.js       # Grievance routes
│   ├── init-db.js               # Initialize default users
│   ├── server.js                # Express server
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.js         # Login component
│   │   │   ├── StudentDashboard.js # Student view
│   │   │   ├── AdminDashboard.js   # Admin view
│   │   │   ├── GrievanceForm.js    # Submit form
│   │   │   └── GrievanceList.js    # Display grievances
│   │   ├── App.js               # Main app with routing
│   │   └── index.js             # React entry point
│   └── package.json
├── database/
│   └── schema.sql                 # Database schema
└── README.md
```

## Database Schema

The system uses 5 main tables:
- **admin** - Admin user accounts
- **students** - Student user accounts
- **category** - Grievance categories
- **status** - Grievance statuses
- **grievance** - Grievance records with foreign keys to other tables

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login (admin or student)
- `POST /api/auth/register` - Register new student account

### Grievances
- `GET /api/grievances` - Get all grievances (students see own, admins see all)
- `GET /api/grievances/:id` - Get single grievance
- `POST /api/grievances` - Create new grievance (students only)
- `PUT /api/grievances/:id/respond` - Respond to grievance (admin only)
- `PUT /api/grievances/:id/status` - Update status (admin only)
- `GET /api/grievances/categories` - Get all categories (public)
- `GET /api/grievances/statuses` - Get all statuses (public)

## Security Notes

- Change default passwords in production
- Use a strong JWT_SECRET in production
- Implement rate limiting for production
- Use HTTPS in production
- Validate and sanitize all inputs

## License

This project is created for educational purposes (DBMS Mini Project).

