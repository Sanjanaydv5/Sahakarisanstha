import { User } from '../models/User.js';
import { AuditLog } from '../models/AuditLog.js';

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = async (req, res) => {
  try {
    const { search, role, status } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    if (role && role !== 'all') {
      filter.role = role;
    }

    if (status !== undefined && status !== 'all') {
      filter.isActive = status === 'active';
    }

    const users = await User.find(filter).select('-password').sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching users'
    });
  }
};

// @desc    Create new user (Admin only)
// @route   POST /api/users
// @access  Private/Admin
export const createUser = async (req, res) => {
  try {
    const { name, username, email, password, role, phone } = req.body;

    if (!name || !username || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, username, email, password, and role'
      });
    }

    const existingUser = await User.findOne({
      $or: [
        { email: email.toLowerCase().trim() },
        { username: username.toLowerCase().trim() }
      ]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email or username already exists'
      });
    }

    const user = await User.create({
      name,
      username: username.toLowerCase().trim(),
      email: email.toLowerCase().trim(),
      password,
      role,
      phone,
      mustChangePassword: true // Require password change on first login
    });

    await AuditLog.create({
      action: 'USER_CREATED',
      module: 'USERS',
      targetId: user._id.toString(),
      performedBy: req.user._id,
      details: { createdUser: user.username, role: user.role }
    });

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        phone: user.phone,
        isActive: user.isActive
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating user'
    });
  }
};

// @desc    Update user details (Admin only)
// @route   PUT /api/users/:id
// @access  Private/Admin
export const updateUser = async (req, res) => {
  try {
    const { name, role, phone, isActive } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (name) user.name = name;
    if (role) user.role = role;
    if (phone !== undefined) user.phone = phone;
    if (isActive !== undefined) user.isActive = isActive;

    await user.save();

    await AuditLog.create({
      action: 'USER_UPDATED',
      module: 'USERS',
      targetId: user._id.toString(),
      performedBy: req.user._id,
      details: { updatedUser: user.username, role, isActive }
    });

    res.json({
      success: true,
      message: 'User updated successfully',
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating user'
    });
  }
};

// @desc    Reset user password (Admin only)
// @route   POST /api/users/:id/reset-password
// @access  Private/Admin
export const resetUserPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters'
      });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.password = newPassword;
    user.mustChangePassword = true;
    await user.save();

    await AuditLog.create({
      action: 'USER_PASSWORD_RESET_BY_ADMIN',
      module: 'USERS',
      targetId: user._id.toString(),
      performedBy: req.user._id,
      details: { targetUser: user.username }
    });

    res.json({
      success: true,
      message: `Password reset successfully for ${user.name}`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error resetting password'
    });
  }
};
