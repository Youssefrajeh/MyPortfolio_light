const express = require('express');
const User = require('../models/User');
const { authenticateToken, requireAdmin, requireOwnershipOrAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all users (admin only)
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, search, role, isActive } = req.query;
    
    const query = {};
    
    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Role filter
    if (role) {
      query.role = role;
    }
    
    // Active status filter
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }
    
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      select: '-password',
      sort: { createdAt: -1 }
    };
    
    const users = await User.paginate(query, options);
    
    res.json({
      success: true,
      users: users.docs,
      pagination: {
        page: users.page,
        limit: users.limit,
        totalDocs: users.totalDocs,
        totalPages: users.totalPages,
        hasNextPage: users.hasNextPage,
        hasPrevPage: users.hasPrevPage
      }
    });
    
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      error: 'Internal server error while fetching users'
    });
  }
});

// Get user by ID
router.get('/:userId', authenticateToken, requireOwnershipOrAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }
    
    res.json({
      success: true,
      user
    });
    
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      error: 'Internal server error while fetching user'
    });
  }
});

// Update user (admin or self)
router.put('/:userId', authenticateToken, requireOwnershipOrAdmin, async (req, res) => {
  try {
    const { name, email, role, isActive, preferences } = req.body;
    const updates = {};
    
    // Only allow certain fields to be updated
    if (name) updates.name = name;
    if (email) updates.email = email;
    if (preferences) updates.preferences = preferences;
    
    // Only admins can update role and isActive
    if (req.user.role === 'admin') {
      if (role !== undefined) updates.role = role;
      if (isActive !== undefined) updates.isActive = isActive;
    }
    
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      updates,
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }
    
    res.json({
      success: true,
      message: 'User updated successfully',
      user
    });
    
  } catch (error) {
    console.error('Update user error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        error: 'Email already exists'
      });
    }
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        error: errors.join(', ')
      });
    }
    
    res.status(500).json({
      error: 'Internal server error while updating user'
    });
  }
});

// Delete user (admin only)
router.delete('/:userId', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }
    
    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        error: 'Cannot delete your own account'
      });
    }
    
    await User.findByIdAndDelete(req.params.userId);
    
    res.json({
      success: true,
      message: 'User deleted successfully'
    });
    
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      error: 'Internal server error while deleting user'
    });
  }
});

// Get user statistics (admin only)
router.get('/stats/overview', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const adminUsers = await User.countDocuments({ role: 'admin' });
    const recentUsers = await User.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    });
    
    res.json({
      success: true,
      stats: {
        totalUsers,
        activeUsers,
        adminUsers,
        recentUsers,
        inactiveUsers: totalUsers - activeUsers
      }
    });
    
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      error: 'Internal server error while fetching user statistics'
    });
  }
});

// Get user activity (admin only)
router.get('/stats/activity', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    
    const activityStats = await User.aggregate([
      {
        $match: {
          lastLogin: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$lastLogin" }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);
    
    res.json({
      success: true,
      activityStats
    });
    
  } catch (error) {
    console.error('Get user activity error:', error);
    res.status(500).json({
      error: 'Internal server error while fetching user activity'
    });
  }
});

module.exports = router; 