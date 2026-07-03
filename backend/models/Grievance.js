const db = require('../config/database');
const Status = require('./Status');

class Grievance {
  static async findAll(studentId = null, role = 'student') {
    let query;
    let params;

    if (role === 'admin') {
      // For admins: Do NOT include student information - keep it anonymous
      query = `
        SELECT 
          g.*,
          NULL as student_username,
          NULL as student_name,
          NULL as student_email,
          c.category_name,
          st.status_name,
          a.username as admin_username,
          a.full_name as admin_name
        FROM grievance g
        JOIN category c ON g.category_id = c.category_id
        JOIN status st ON g.status_id = st.status_id
        LEFT JOIN admin a ON g.admin_id = a.admin_id
        ORDER BY g.created_at DESC
      `;
      params = [];
    } else {
      // For students: Show their own information
      query = `
        SELECT 
          g.*,
          s.username as student_username,
          s.full_name as student_name,
          s.email as student_email,
          c.category_name,
          st.status_name,
          a.username as admin_username,
          a.full_name as admin_name
        FROM grievance g
        JOIN students s ON g.student_id = s.student_id
        JOIN category c ON g.category_id = c.category_id
        JOIN status st ON g.status_id = st.status_id
        LEFT JOIN admin a ON g.admin_id = a.admin_id
        WHERE g.student_id = ?
        ORDER BY g.created_at DESC
      `;
      params = [studentId];
    }

    const [rows] = await db.execute(query, params);
    return rows;
  }

  static async findById(id, studentId = null, role = 'student') {
    let query;
    let params;

    if (role === 'admin') {
      // For admins: Do NOT include student information - keep it anonymous
      query = `
        SELECT 
          g.*,
          NULL as student_username,
          NULL as student_name,
          NULL as student_email,
          c.category_name,
          st.status_name,
          a.username as admin_username,
          a.full_name as admin_name
        FROM grievance g
        JOIN category c ON g.category_id = c.category_id
        JOIN status st ON g.status_id = st.status_id
        LEFT JOIN admin a ON g.admin_id = a.admin_id
        WHERE g.grievance_id = ?
      `;
      params = [id];
    } else {
      // For students: Show their own information
      query = `
        SELECT 
          g.*,
          s.username as student_username,
          s.full_name as student_name,
          s.email as student_email,
          c.category_name,
          st.status_name,
          a.username as admin_username,
          a.full_name as admin_name
        FROM grievance g
        JOIN students s ON g.student_id = s.student_id
        JOIN category c ON g.category_id = c.category_id
        JOIN status st ON g.status_id = st.status_id
        LEFT JOIN admin a ON g.admin_id = a.admin_id
        WHERE g.grievance_id = ? AND g.student_id = ?
      `;
      params = [id, studentId];
    }

    const [rows] = await db.execute(query, params);
    return rows[0];
  }

  static async create(studentId, title, description, categoryId) {
    // Default status_id is 1 (pending)
    const [result] = await db.execute(
      'INSERT INTO grievance (student_id, category_id, status_id, title, description) VALUES (?, ?, 1, ?, ?)',
      [studentId, categoryId, title, description]
    );
    return result.insertId;
  }

  static async updateResponse(id, adminId, adminResponse) {
    const [result] = await db.execute(
      'UPDATE grievance SET admin_response = ?, admin_id = ?, updated_at = CURRENT_TIMESTAMP WHERE grievance_id = ?',
      [adminResponse, adminId, id]
    );
    return result.affectedRows > 0;
  }

  static async updateStatus(id, statusId) {
    const [result] = await db.execute(
      'UPDATE grievance SET status_id = ?, updated_at = CURRENT_TIMESTAMP WHERE grievance_id = ?',
      [statusId, id]
    );
    return result.affectedRows > 0;
  }

  static async updateRating(id, studentId, rating) {
    // First, get the resolved status_id
    const resolvedStatus = await Status.findByName('resolved');
    
    if (!resolvedStatus) {
      throw new Error('Resolved status not found in database');
    }

    console.log('Updating rating:', { id, studentId, rating, resolvedStatusId: resolvedStatus.status_id });

    // Only allow rating if the grievance belongs to the student and is resolved
    const [result] = await db.execute(
      `UPDATE grievance 
       SET rating = ?, updated_at = CURRENT_TIMESTAMP 
       WHERE grievance_id = ? 
       AND student_id = ? 
       AND status_id = ?`,
      [parseInt(rating), parseInt(id), parseInt(studentId), parseInt(resolvedStatus.status_id)]
    );
    
    console.log('Update result:', { affectedRows: result.affectedRows });
    
    return result.affectedRows > 0;
  }
}

module.exports = Grievance;
