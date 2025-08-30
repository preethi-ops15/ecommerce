const Query = require('../models/Query');

// Create a new query (public route)
const createQuery = async (req, res) => {
  try {
    const { name, email, phone, subject, message, category } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Create new query
    const query = new Query({
      name,
      email,
      phone,
      subject,
      message,
      category: category || 'general'
    });

    await query.save();

    res.status(201).json({
      success: true,
      message: 'Query submitted successfully',
      data: query
    });
  } catch (error) {
    console.error('Error creating query:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting query'
    });
  }
};

// Get all queries (admin only)
const getAllQueries = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status, category, priority } = req.query;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } }
      ];
    }
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;

    // Get queries with pagination
    const queries = await Query.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('assignedTo', 'name email')
      .populate('adminReply.repliedBy', 'name email');

    // Get total count
    const total = await Query.countDocuments(filter);

    res.json({
      success: true,
      data: {
        queries,
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching queries:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching queries'
    });
  }
};

// Get query by ID
const getQueryById = async (req, res) => {
  try {
    const { id } = req.params;

    const query = await Query.findById(id)
      .populate('assignedTo', 'name email')
      .populate('adminReply.repliedBy', 'name email');

    if (!query) {
      return res.status(404).json({
        success: false,
        message: 'Query not found'
      });
    }

    res.json({
      success: true,
      data: query
    });
  } catch (error) {
    console.error('Error fetching query:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching query'
    });
  }
};

// Update query status
const updateQueryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, priority, assignedTo } = req.body;

    const updateData = {};
    if (status) updateData.status = status;
    if (priority) updateData.priority = priority;
    if (assignedTo) updateData.assignedTo = assignedTo;

    const query = await Query.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).populate('assignedTo', 'name email');

    if (!query) {
      return res.status(404).json({
        success: false,
        message: 'Query not found'
      });
    }

    res.json({
      success: true,
      message: 'Query updated successfully',
      data: query
    });
  } catch (error) {
    console.error('Error updating query:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating query'
    });
  }
};

// Admin reply to query
const replyToQuery = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;
    const adminId = req.user.id; // From JWT token

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Reply message is required'
      });
    }

    const query = await Query.findByIdAndUpdate(
      id,
      {
        'adminReply.message': message,
        'adminReply.repliedBy': adminId,
        'adminReply.repliedAt': new Date(),
        status: 'resolved'
      },
      { new: true }
    ).populate('adminReply.repliedBy', 'name email');

    if (!query) {
      return res.status(404).json({
        success: false,
        message: 'Query not found'
      });
    }

    res.json({
      success: true,
      message: 'Reply sent successfully',
      data: query
    });
  } catch (error) {
    console.error('Error replying to query:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending reply'
    });
  }
};

// Delete query
const deleteQuery = async (req, res) => {
  try {
    const { id } = req.params;

    const query = await Query.findByIdAndDelete(id);

    if (!query) {
      return res.status(404).json({
        success: false,
        message: 'Query not found'
      });
    }

    res.json({
      success: true,
      message: 'Query deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting query:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting query'
    });
  }
};

// Get query statistics
const getQueryStats = async (req, res) => {
  try {
    const stats = await Query.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          pending: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
          },
          inProgress: {
            $sum: { $cond: [{ $eq: ['$status', 'in-progress'] }, 1, 0] }
          },
          resolved: {
            $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] }
          },
          closed: {
            $sum: { $cond: [{ $eq: ['$status', 'closed'] }, 1, 0] }
          }
        }
      }
    ]);

    const categoryStats = await Query.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    const priorityStats = await Query.aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        overall: stats[0] || {
          total: 0,
          pending: 0,
          inProgress: 0,
          resolved: 0,
          closed: 0
        },
        byCategory: categoryStats,
        byPriority: priorityStats
      }
    });
  } catch (error) {
    console.error('Error fetching query stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching query statistics'
    });
  }
};

module.exports = {
  createQuery,
  getAllQueries,
  getQueryById,
  updateQueryStatus,
  replyToQuery,
  deleteQuery,
  getQueryStats
}; 