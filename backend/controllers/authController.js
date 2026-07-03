const Admin = require('../models/Admin');
const Student = require('../models/Student');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key_here_change_in_production';

const login = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username, password, and role are required' 
      });
    }

    let user;
    let userData;

    if (role === 'admin') {
      user = await Admin.findByUsername(username);
      if (user) {
        const isPasswordValid = await Admin.verifyPassword(password, user.password);
        if (!isPasswordValid) {
          return res.status(401).json({ 
            success: false, 
            message: 'Invalid credentials' 
          });
        }
        userData = {
          id: user.admin_id,
          username: user.username,
          role: 'admin',
          email: user.email,
          fullName: user.full_name
        };
      }
    } else if (role === 'student') {
      user = await Student.findByUsername(username);
      if (user) {
        const isPasswordValid = await Student.verifyPassword(password, user.password);
        if (!isPasswordValid) {
          return res.status(401).json({ 
            success: false, 
            message: 'Invalid credentials' 
          });
        }
        userData = {
          id: user.student_id,
          username: user.username,
          role: 'student',
          email: user.email,
          fullName: user.full_name
        };
      }
    } else {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid role' 
      });
    }

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    const token = jwt.sign(
      { userId: userData.id, role: userData.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      user: userData
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during login' 
    });
  }
};

const register = async (req, res) => {
  try {
    const { username, password, email, fullName, studentIdNumber, phone } = req.body;

    if (!username || !password || !email || !fullName) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username, password, email, and full name are required' 
      });
    }

    // Check if username already exists
    const existingUser = await Student.findByUsername(username);
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username already exists' 
      });
    }

    // Check if email already exists
    const existingEmail = await Student.findByEmail(email);
    if (existingEmail) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email already registered' 
      });
    }

    const studentId = await Student.create(
      username,
      password,
      email,
      fullName,
      studentIdNumber || null,
      phone || null
    );

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: { id: studentId }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during registration' 
    });
  }
};

module.exports = { login, register };
