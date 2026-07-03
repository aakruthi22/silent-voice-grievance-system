[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
# 🤫 Silent Voice: Anonymous Grievance Management System

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)

A secure, full-stack web application designed to facilitate anonymous grievance submission, tracking, and resolution within institutional environments. Built with a focus on data integrity, scalable architecture, and efficient workflows to ensure voices are heard safely and resolved systematically.

## ✨ Key Features

*   **Secure Anonymity:** Employs advanced routing and database structuring to ensure user privacy while allowing comprehensive issue reporting.
*   **Role-Based Access Control (RBAC):** Secure JWT authentication and authorization for different user tiers (Students/Staff vs. Administrators).
*   **Real-Time Status Tracking:** State-managed UI components for seamless updates on grievance lifecycles (Submitted ➔ In-Progress ➔ Resolved).
*   **RESTful API Architecture:** Modular controllers and optimized routing handling efficient client-server communication.
*   **High-Performance Data Management:** Optimized MySQL relational queries ensuring fast retrieval, referential integrity, and scalability.

## 🛠️ Technology Stack

**Client-Side (Frontend):**
*   **React.js:** Component-driven UI development.
*   **State Management:** React Context API / Hooks.
*   **Routing:** React Router DOM.

**Server-Side (Backend):**
*   **Node.js & Express.js:** Scalable server architecture and REST API development.
*   **Authentication:** JSON Web Tokens (JWT) & bcrypt for password hashing.
*   **CORS & Helmet:** Security middleware for cross-origin requests and HTTP header protection.

**Database:**
*   **MySQL:** Relational database for structured grievance logging and user management.

## 🚀 Installation & Local Setup

### Prerequisites
*   [Node.js](https://nodejs.org/) (v14 or higher)
*   [MySQL Server](https://www.mysql.com/) installed and running locally

### 1. Clone the Repository
```bash
git clone [https://github.com/YourUsername/silent-voice.git](https://github.com/YourUsername/silent-voice.git)
cd silent-voice

```

### 2. Database Configuration

1. Open your MySQL CLI or Workbench.
2. Create a new database: `CREATE DATABASE silent_voice_db;`
3. Execute the SQL scripts located in the `/database/schema.sql` file (if provided) to build the required tables.

### 3. Backend Setup

```bash
cd backend
npm install

```

Create a `.env` file in the root of the `backend` directory and configure the following variables:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=silent_voice_db
JWT_SECRET=your_super_secret_jwt_key

```

Start the backend development server:

```bash
npm run dev

```

### 4. Frontend Setup

Open a new terminal window:

```bash
cd frontend
npm install

```

Start the React development server:

```bash
npm start

```

The application will be running at `http://localhost:3000`.

## 🔌 API Endpoints Reference

### Authentication

* `POST /api/auth/register` - Register a new admin/user.
* `POST /api/auth/login` - Authenticate and receive a JWT.

### Grievances

* `POST /api/grievances` - (Authenticated) Submit a new anonymous grievance.
* `GET /api/grievances/my-reports` - (Authenticated) Retrieve tracking status for submitted grievances.
* `GET /api/admin/grievances` - (Admin Only) Retrieve all institutional grievances.
* `PUT /api/admin/grievances/:id/status` - (Admin Only) Update the resolution status of a grievance.

## 🗄️ Core Database Schema

* **Users Table:** `id`, `username`, `password_hash`, `role`, `created_at`
* **Grievances Table:** `id`, `tracking_id`, `category`, `description`, `status`, `submitted_at`, `resolved_at`
* **Categories Table:** `id`, `department_name`, `assigned_admin_id`

## 🔮 Future Enhancements

* Integration of an AI-powered sentiment analysis tool to flag high-priority/urgent grievances automatically.
* Automated email dispatch system using NodeMailer for status updates.
* Admin analytics dashboard utilizing Chart.js to visualize issue resolution efficiency.

## 📝 License

This project is licensed under the MIT License. Feel free to use, modify, and distribute it as per the terms of the license.



