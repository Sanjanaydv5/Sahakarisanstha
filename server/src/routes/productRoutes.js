import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct
} from '../controllers/productController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/rbac.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getProducts)
  .post(authorize('admin', 'manager'), createProduct);

router.route('/:id')
  .get(getProductById)
  .put(authorize('admin', 'manager'), updateProduct);

export default router;
