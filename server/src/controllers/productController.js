import { Product } from '../models/Product.js';
import { StockEntry } from '../models/StockEntry.js';
import { AuditLog } from '../models/AuditLog.js';
import { getNepaliDate } from '../utils/nepaliDate.js';

// @desc    Get all products
// @route   GET /api/products
// @access  Public / Authenticated
export const getProducts = async (req, res) => {
  try {
    const { category, lowStock, search } = req.query;
    const filter = { isActive: true };

    if (category && category !== 'all') {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { nameEnglish: { $regex: search, $options: 'i' } }
      ];
    }

    let products = await Product.find(filter).sort({ name: 1 });

    if (lowStock === 'true') {
      products = products.filter(p => p.currentStock <= p.reorderLevel);
    }

    // Calculate total valuation
    const totalValuation = products.reduce((sum, p) => sum + (p.currentStock * p.pricePerUnit), 0);
    const lowStockCount = products.filter(p => p.currentStock <= p.reorderLevel).length;

    res.json({
      success: true,
      count: products.length,
      lowStockCount,
      totalValuation,
      products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching products'
    });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Private
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Get stock entries history for this product
    const stockHistory = await StockEntry.find({ product: product._id })
      .populate('performedBy', 'name role')
      .sort({ date: -1 })
      .limit(30);

    res.json({
      success: true,
      product,
      stockHistory
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching product'
    });
  }
};

// @desc    Create new product (Admin/Manager)
// @route   POST /api/products
// @access  Private/Admin/Manager
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      nameEnglish,
      category,
      unit,
      initialStock,
      reorderLevel,
      pricePerUnit,
      costPrice,
      description
    } = req.body;

    if (!name || pricePerUnit === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Product name and price per unit are required'
      });
    }

    const currentStock = Number(initialStock) || 0;

    const product = await Product.create({
      name,
      nameEnglish: nameEnglish || '',
      category: category || 'fertilizer',
      unit: unit || 'बोरा (50 kg)',
      currentStock,
      reorderLevel: Number(reorderLevel) || 10,
      pricePerUnit: Number(pricePerUnit) || 0,
      costPrice: Number(costPrice) || 0,
      description: description || ''
    });

    // If initial stock provided, log StockEntry
    if (currentStock > 0) {
      const nepaliDate = getNepaliDate().formattedDevanagari;
      await StockEntry.create({
        product: product._id,
        type: 'in',
        quantity: currentStock,
        previousStock: 0,
        newStock: currentStock,
        unitPrice: Number(costPrice) || 0,
        totalAmount: currentStock * (Number(costPrice) || 0),
        nepaliDate,
        reference: 'Initial Stock Setup',
        performedBy: req.user._id,
        notes: 'Initial inventory on product creation'
      });
    }

    await AuditLog.create({
      action: 'PRODUCT_CREATED',
      module: 'INVENTORY',
      targetId: product._id.toString(),
      performedBy: req.user._id,
      details: { name: product.name, initialStock: currentStock }
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating product'
    });
  }
};

// @desc    Update product details
// @route   PUT /api/products/:id
// @access  Private/Admin/Manager
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const fields = [
      'name', 'nameEnglish', 'category', 'unit', 'reorderLevel',
      'pricePerUnit', 'costPrice', 'isActive', 'description'
    ];

    fields.forEach(field => {
      if (req.body[field] !== undefined) {
        product[field] = req.body[field];
      }
    });

    await product.save();

    res.json({
      success: true,
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating product'
    });
  }
};
