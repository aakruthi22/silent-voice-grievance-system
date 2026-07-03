const db = require('../config/database');

class Status {
  static async findAll() {
    const [rows] = await db.execute(
      'SELECT * FROM status ORDER BY status_id'
    );
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.execute(
      'SELECT * FROM status WHERE status_id = ?',
      [id]
    );
    return rows[0];
  }

  static async findByName(name) {
    const [rows] = await db.execute(
      'SELECT * FROM status WHERE status_name = ?',
      [name]
    );
    return rows[0];
  }
}

module.exports = Status;

