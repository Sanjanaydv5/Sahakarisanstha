import express from 'express';
import rateLimit from 'express-rate-limit';
import { login, getMe, changePassword, updateProfile } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Strict Rate Limiter for Login (10 attempts per 15 minutes per IP)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'सुरक्षा सतर्कता: धेरै पटक लगइन प्रयास गरियो । कृपया १५ मिनेटपछि पुनः प्रयास गर्नुहोस् । (Too many login attempts. Please try again after 15 minutes.)'
  }
});

router.post('/login', loginLimiter, login);
router.get('/me', protect, getMe);
router.post('/change-password', protect, changePassword);
router.put('/profile', protect, updateProfile);

export default router;
