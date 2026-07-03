const db = require('../config/database');

class Category {
  static async findAll() {
    const [rows] = await db.execute(
      'SELECT * FROM category ORDER BY category_name'
    );
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.execute(
      'SELECT * FROM category WHERE category_id = ?',
      [id]
    );
    return rows[0];
  }

  static async findByName(name) {
    const [rows] = await db.execute(
      'SELECT * FROM category WHERE category_name = ?',
      [name]
    );
    return rows[0];
  }
}

module.exports = Category;

