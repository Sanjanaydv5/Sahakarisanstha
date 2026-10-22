import { User } from '../models/User.js';
import { generateToken, generateRefreshToken } from '../middleware/auth.js';
import { AuditLog } from '../models/AuditLog.js';

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { loginId, password } = req.body;

    if (!loginId || !password) {
      return res.status(400).json({
        success: false,
        message: 'कृपया युजरनेम वा ईमेल र पासवर्ड प्रविष्ट गर्नुहोस् । (Please provide username/email and password)'
      });
    }

    const cleanLoginId = loginId.toLowerCase().trim();

    // Map common aliases (e.g. sahakari_admin <-> admin, etc.)
    const queryConditions = [
      { email: cleanLoginId },
      { username: cleanLoginId }
    ];
    if (cleanLoginId === 'admin') queryConditions.push({ username: 'sahakari_admin' });
    if (cleanLoginId === 'manager') queryConditions.push({ username: 'sahakari_manager' });
    if (cleanLoginId === 'staff') queryConditions.push({ username: 'sahakari_staff' });
    if (cleanLoginId === 'sahakari_admin') queryConditions.push({ username: 'admin' });
    if (cleanLoginId === 'sahakari_manager') queryConditions.push({ username: 'manager' });
    if (cleanLoginId === 'sahakari_staff') queryConditions.push({ username: 'staff' });

    // Check by email or username
    const user = await User.findOne({
      $or: queryConditions
    }).select('+password');

    // Generic error message to prevent username enumeration by outsiders
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'लगइन विवरण मिलेन । कृपया युजरनेम र पासवर्ड जाँच गर्नुहोस् । (Invalid username or password)'
      });
    }

    // Check account lockout
    if (user.lockUntil && user.lockUntil > new Date()) {
      const minutesRemaining = Math.ceil((user.lockUntil - new Date()) / (60 * 1000));
      return res.status(423).json({
        success: false,
        message: `सुरक्षा सतर्कता: लगातार धेरै पटक गलत पासवर्ड प्रविष्ट भएकाले खाता अस्थायी रूपमा लक गरिएको छ । कृपया ${minutesRemaining} मिनेटपछि प्रयास गर्नुहोस् । (Account locked due to multiple failed attempts)`
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'तपाईंको खाता निष्क्रिय गरिएको छ । कृपया मुख्य प्रशासनमा सम्पर्क गर्नुहोस् । (Account deactivated)'
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      // Increment failed attempts
      user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
      
      // Lock for 15 minutes after 5 consecutive failures
      let isLockedNow = false;
      if (user.failedLoginAttempts >= 5) {
        user.lockUntil = new Date(Date.now() + 15 * 60 * 1000);
        isLockedNow = true;
      }
      await user.save({ validateBeforeSave: false });

      const clientIp = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      await AuditLog.create({
        action: 'LOGIN_FAILED',
        module: 'AUTH',
        targetId: user._id.toString(),
        details: {
          username: user.username,
          role: user.role,
          failedAttempts: user.failedLoginAttempts,
          ip: clientIp
        }
      });

      const remainingAttempts = Math.max(0, 5 - user.failedLoginAttempts);
      const warningText = isLockedNow
        ? '५ पटक गलत पासवर्ड भएकाले खाता १५ मिनेटका लागि लक भयो । (Account locked for 15 minutes)'
        : `${remainingAttempts} प्रयास बाँकी छ । (${remainingAttempts} attempts remaining)`;

      return res.status(401).json({
        success: false,
        message: `गलत पासवर्ड । ${warningText}`
      });
    }

    // Successful login: reset failed counters
    user.failedLoginAttempts = 0;
    user.lockUntil = null;
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    // Generate secure tokens
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Audit log
    const clientIp = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    await AuditLog.create({
      action: 'USER_LOGIN',
      module: 'AUTH',
      targetId: user._id.toString(),
      performedBy: user._id,
      details: {
        username: user.username,
        role: user.role,
        ip: clientIp
      }
    });

    res.json({
      success: true,
      message: 'Login successful',
      token,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        phone: user.phone,
        mustChangePassword: user.mustChangePassword
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during login'
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
};

// @desc    Change password
// @route   POST /api/auth/change-password
// @access  Private
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both current password and new password'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long'
      });
    }

    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.matchPassword(currentPassword);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    user.password = newPassword;
    user.mustChangePassword = false;
    await user.save();

    await AuditLog.create({
      action: 'PASSWORD_CHANGED',
      module: 'AUTH',
      targetId: user._id.toString(),
      performedBy: user._id
    });

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error changing password'
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;
    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (phone) user.phone = phone;

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        phone: user.phone
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating profile'
    });
  }
};
