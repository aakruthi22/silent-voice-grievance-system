-- Create database
CREATE DATABASE IF NOT EXISTS grievance_system;
USE grievance_system;

-- Admin table
CREATE TABLE IF NOT EXISTS admin (
  admin_id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(100) UNIQUE,
  full_name VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Students table
CREATE TABLE IF NOT EXISTS students (
  student_id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  student_id_number VARCHAR(50) UNIQUE,
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Category table
CREATE TABLE IF NOT EXISTS category (
  category_id INT PRIMARY KEY AUTO_INCREMENT,
  category_name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Status table
CREATE TABLE IF NOT EXISTS status (
  status_id INT PRIMARY KEY AUTO_INCREMENT,
  status_name VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Grievance table
CREATE TABLE IF NOT EXISTS grievance (
  grievance_id INT PRIMARY KEY AUTO_INCREMENT,
  student_id INT NOT NULL,
  category_id INT NOT NULL,
  status_id INT NOT NULL DEFAULT 1,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  admin_response TEXT,
  admin_id INT,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES category(category_id),
  FOREIGN KEY (status_id) REFERENCES status(status_id),
  FOREIGN KEY (admin_id) REFERENCES admin(admin_id) ON DELETE SET NULL
);

-- Insert default statuses
INSERT INTO status (status_name, description) VALUES
('pending', 'Grievance is pending review'),
('in_progress', 'Grievance is being processed'),
('resolved', 'Grievance has been resolved')
ON DUPLICATE KEY UPDATE status_name=status_name;

-- Insert default categories
INSERT INTO category (category_name, description) VALUES
('General', 'General grievances and complaints'),
('Academic', 'Academic related issues'),
('Infrastructure', 'Infrastructure and facilities'),
('Hostel', 'Hostel and accommodation issues'),
('Library', 'Library related issues'),
('Other', 'Other miscellaneous issues')
ON DUPLICATE KEY UPDATE category_name=category_name;

-- Insert sample admin (password: admin123)
-- Password hash will be set by init-db.js
-- Admin: username=admin, password=admin123, email=admin@grievance.com

-- Insert sample student (password: student123)
-- Password hash will be set by init-db.js
-- Student: username=student, password=student123, email=student@example.com
