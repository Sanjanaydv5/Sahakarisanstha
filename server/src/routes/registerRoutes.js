import express from 'express';
import { getDistributionRegister } from '../controllers/registerController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/', getDistributionRegister);

export default router;
