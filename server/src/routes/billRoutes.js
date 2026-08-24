import express from 'express';
import {
  createBill,
  getBills,
  getBillById,
  voidBill
} from '../controllers/billController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/rbac.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getBills)
  .post(createBill); // All roles (admin, manager, staff) can create bills

router.route('/:id')
  .get(getBillById);

router.put('/:id/void', authorize('admin', 'manager'), voidBill);

export default router;
