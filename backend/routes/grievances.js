const express = require('express');
const router = express.Router();
const { authenticate, requireAdmin } = require('../middleware/auth');
const {
  getAllGrievances,
  getGrievanceById,
  createGrievance,
  respondToGrievance,
  updateGrievanceStatus,
  getCategories,
  getStatuses,
  rateGrievance
} = require('../controllers/grievanceController');

// Public routes
router.get('/categories', getCategories);
router.get('/statuses', getStatuses);

// All other routes require authentication
router.use(authenticate);

// Get all grievances (students see own, admins see all)
router.get('/', getAllGrievances);

// Get single grievance
router.get('/:id', getGrievanceById);

// Create grievance (students only)
router.post('/', createGrievance);

// Respond to grievance (admin only)
router.put('/:id/respond', requireAdmin, respondToGrievance);

// Update status (admin only)
router.put('/:id/status', requireAdmin, updateGrievanceStatus);

// Rate grievance (students only, for resolved grievances)
router.put('/:id/rate', rateGrievance);

module.exports = router;
