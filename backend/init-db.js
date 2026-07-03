require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('./config/database');

async function initializeDatabase() {
  try {
    // Create sample admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    await db.execute(
      'INSERT INTO admin (username, password, email, full_name) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE username=username',
      ['admin', adminPassword, 'admin@grievance.com', 'System Administrator']
    );

    // Create sample student user
    const studentPassword = await bcrypt.hash('student123', 10);
    await db.execute(
      'INSERT INTO students (username, password, email, full_name, student_id_number, phone) VALUES (?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE username=username',
      ['student', studentPassword, 'student@example.com', 'John Doe', 'STU001', '1234567890']
    );

    console.log('Sample users created successfully!');
    console.log('Admin: username=admin, password=admin123');
    console.log('Student: username=student, password=student123');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
  process.exit();
}

initializeDatabase();
