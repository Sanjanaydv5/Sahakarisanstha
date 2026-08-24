import express from 'express';
import { getUsers, createUser, updateUser, resetUserPassword } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/rbac.js';

const router = express.Router();

router.use(protect);
router.use(authorize('admin')); // All user management endpoints are Admin-only

router.route('/')
  .get(getUsers)
  .post(createUser);

router.route('/:id')
  .put(updateUser);

router.post('/:id/reset-password', resetUserPassword);

export default router;
