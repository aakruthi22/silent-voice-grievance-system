const db = require('../config/database');
const bcrypt = require('bcryptjs');

class Admin {
  static async findByUsername(username) {
    const [rows] = await db.execute(
      'SELECT * FROM admin WHERE username = ?',
      [username]
    );
    return rows[0];
  }

  static async findById(id) {
    const [rows] = await db.execute(
      'SELECT admin_id, username, email, full_name, created_at FROM admin WHERE admin_id = ?',
      [id]
    );
    return rows[0];
  }

  static async create(username, password, email, fullName) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.execute(
      'INSERT INTO admin (username, password, email, full_name) VALUES (?, ?, ?, ?)',
      [username, hashedPassword, email, fullName]
    );
    return result.insertId;
  }

  static async verifyPassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }
}

module.exports = Admin;

