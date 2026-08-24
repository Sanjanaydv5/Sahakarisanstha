import express from 'express';
import {
  getDuesSummary,
  recordDuePayment,
  getPaymentHistory
} from '../controllers/duesController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/', getDuesSummary);
router.post('/pay', recordDuePayment);
router.get('/payments', getPaymentHistory);

export default router;
