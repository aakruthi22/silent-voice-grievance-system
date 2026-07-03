const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Student = require('../models/Student');

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key_here_change_in_production';

const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    let user;

    if (decoded.role === 'admin') {
      user = await Admin.findById(decoded.userId);
      if (user) {
        req.user = {
          id: user.admin_id,
          username: user.username,
          role: 'admin',
          email: user.email,
          fullName: user.full_name
        };
      }
    } else if (decoded.role === 'student') {
      user = await Student.findById(decoded.userId);
      if (user) {
        req.user = {
          id: user.student_id,
          username: user.username,
          role: 'student',
          email: user.email,
          fullName: user.full_name
        };
      }
    }

    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Admin access required' });
  }
  next();
};

module.exports = { authenticate, requireAdmin };
