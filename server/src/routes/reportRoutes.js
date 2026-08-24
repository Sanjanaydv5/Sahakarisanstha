import express from 'express';
import {
  getAdminDashboardStats,
  getManagerDashboardStats,
  getStaffDashboardStats,
  getDailyCashClosing
} from '../controllers/reportController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/rbac.js';

const router = express.Router();

router.use(protect);

router.get('/admin-dashboard', authorize('admin'), getAdminDashboardStats);
router.get('/manager-dashboard', authorize('admin', 'manager'), getManagerDashboardStats);
router.get('/staff-dashboard', getStaffDashboardStats);
router.get('/daily-closing', authorize('admin', 'manager', 'staff'), getDailyCashClosing);

export default router;
