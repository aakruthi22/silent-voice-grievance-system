const db = require('../config/database');
const bcrypt = require('bcryptjs');

class Student {
  static async findByUsername(username) {
    const [rows] = await db.execute(
      'SELECT * FROM students WHERE username = ?',
      [username]
    );
    return rows[0];
  }

  static async findByEmail(email) {
    const [rows] = await db.execute(
      'SELECT * FROM students WHERE email = ?',
      [email]
    );
    return rows[0];
  }

  static async findById(id) {
    const [rows] = await db.execute(
      'SELECT student_id, username, email, full_name, student_id_number, phone, created_at FROM students WHERE student_id = ?',
      [id]
    );
    return rows[0];
  }

  static async create(username, password, email, fullName, studentIdNumber, phone) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.execute(
      'INSERT INTO students (username, password, email, full_name, student_id_number, phone) VALUES (?, ?, ?, ?, ?, ?)',
      [username, hashedPassword, email, fullName, studentIdNumber, phone]
    );
    return result.insertId;
  }

  static async verifyPassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }
}

module.exports = Student;

