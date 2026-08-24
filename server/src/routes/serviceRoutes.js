import express from 'express';
import {
  createServiceTransaction,
  getServiceTransactions
} from '../controllers/serviceController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getServiceTransactions)
  .post(createServiceTransaction);

export default router;
