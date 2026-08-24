import express from 'express';
import {
  recordStockIn,
  recordStockOut,
  getStockLedger,
  getLowStockAlerts
} from '../controllers/inventoryController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/rbac.js';

const router = express.Router();

router.use(protect);

router.post('/stock-in', authorize('admin', 'manager'), recordStockIn);
router.post('/stock-out', authorize('admin', 'manager'), recordStockOut);
router.get('/ledger', getStockLedger);
router.get('/low-stock', getLowStockAlerts);

export default router;
