const Grievance = require('../models/Grievance');
const Category = require('../models/Category');
const Status = require('../models/Status');

const getAllGrievances = async (req, res) => {
  try {
    const userId = req.user.role === 'student' ? req.user.id : null;
    const grievances = await Grievance.findAll(userId, req.user.role);
    
    res.json({
      success: true,
      data: grievances
    });
  } catch (error) {
    console.error('Get grievances error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching grievances' 
    });
  }
};

const getGrievanceById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.role === 'student' ? req.user.id : null;
    const grievance = await Grievance.findById(id, userId, req.user.role);

    if (!grievance) {
      return res.status(404).json({ 
        success: false, 
        message: 'Grievance not found' 
      });
    }

    res.json({
      success: true,
      data: grievance
    });
  } catch (error) {
    console.error('Get grievance error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching grievance' 
    });
  }
};

const createGrievance = async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ 
        success: false, 
        message: 'Only students can create grievances' 
      });
    }

    const { title, description, categoryId } = req.body;

    if (!title || !description || !categoryId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Title, description, and category are required' 
      });
    }

    // Verify category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid category' 
      });
    }

    const grievanceId = await Grievance.create(
      req.user.id,
      title,
      description,
      categoryId
    );

    res.status(201).json({
      success: true,
      message: 'Grievance created successfully',
      data: { id: grievanceId }
    });
  } catch (error) {
    console.error('Create grievance error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error creating grievance' 
    });
  }
};

const respondToGrievance = async (req, res) => {
  try {
    const { id } = req.params;
    const { admin_response } = req.body;

    if (!admin_response) {
      return res.status(400).json({ 
        success: false, 
        message: 'Response is required' 
      });
    }

    const updated = await Grievance.updateResponse(id, req.user.id, admin_response);

    if (!updated) {
      return res.status(404).json({ 
        success: false, 
        message: 'Grievance not found' 
      });
    }

    res.json({
      success: true,
      message: 'Response added successfully'
    });
  } catch (error) {
    console.error('Respond to grievance error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error responding to grievance' 
    });
  }
};

const updateGrievanceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { statusId } = req.body;

    if (!statusId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Status ID is required' 
      });
    }

    // Verify status exists
    const status = await Status.findById(statusId);
    if (!status) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid status' 
      });
    }

    const updated = await Grievance.updateStatus(id, statusId);

    if (!updated) {
      return res.status(404).json({ 
        success: false, 
        message: 'Grievance not found' 
      });
    }

    res.json({
      success: true,
      message: 'Status updated successfully'
    });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error updating status' 
    });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching categories' 
    });
  }
};

const getStatuses = async (req, res) => {
  try {
    const statuses = await Status.findAll();
    res.json({
      success: true,
      data: statuses
    });
  } catch (error) {
    console.error('Get statuses error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching statuses' 
    });
  }
};

const rateGrievance = async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ 
        success: false, 
        message: 'Only students can rate grievances' 
      });
    }

    const { id } = req.params;
    const { rating } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ 
        success: false, 
        message: 'Rating must be between 1 and 5' 
      });
    }

    // First verify the grievance exists and belongs to the student
    const grievance = await Grievance.findById(id, req.user.id, 'student');
    
    if (!grievance) {
      return res.status(404).json({ 
        success: false, 
        message: 'Grievance not found or does not belong to you' 
      });
    }

    // Check if grievance is resolved
    if (grievance.status_name !== 'resolved') {
      return res.status(400).json({ 
        success: false, 
        message: 'You can only rate resolved grievances' 
      });
    }

    try {
      const updated = await Grievance.updateRating(id, req.user.id, parseInt(rating));

      if (!updated) {
        console.error('Rating update failed - no rows affected', { id, userId: req.user.id, rating });
        return res.status(500).json({ 
          success: false, 
          message: 'Failed to update rating. The grievance may not be resolved or may not belong to you.' 
        });
      }
    } catch (dbError) {
      console.error('Database error updating rating:', dbError);
      return res.status(500).json({ 
        success: false, 
        message: `Database error: ${dbError.message}` 
      });
    }

    res.json({
      success: true,
      message: 'Rating submitted successfully'
    });
  } catch (error) {
    console.error('Rate grievance error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Error submitting rating' 
    });
  }
};

module.exports = {
  getAllGrievances,
  getGrievanceById,
  createGrievance,
  respondToGrievance,
  updateGrievanceStatus,
  getCategories,
  getStatuses,
  rateGrievance
};
