import { Product } from '../models/Product.js';
import { StockEntry } from '../models/StockEntry.js';
import { AuditLog } from '../models/AuditLog.js';
import { getNepaliDate } from '../utils/nepaliDate.js';

// @desc    Record Stock-In (Purchase/Restocking from Supplier)
// @route   POST /api/inventory/stock-in
// @access  Private/Admin/Manager
export const recordStockIn = async (req, res) => {
  try {
    const {
      productId,
      quantity,
      unitPrice,
      supplierName,
      supplierInvoiceNo,
      notes
    } = req.body;

    if (!productId || !quantity || Number(quantity) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide valid product and quantity'
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const qty = Number(quantity);
    const cost = Number(unitPrice) || product.costPrice || 0;
    const prevStock = product.currentStock;
    const newStock = prevStock + qty;

    product.currentStock = newStock;
    if (cost > 0) product.costPrice = cost;
    await product.save();

    const nepaliDate = getNepaliDate().formattedDevanagari;

    const stockEntry = await StockEntry.create({
      product: product._id,
      type: 'in',
      quantity: qty,
      previousStock: prevStock,
      newStock,
      unitPrice: cost,
      totalAmount: qty * cost,
      supplierName: supplierName || 'कृषि सामग्री कम्पनी / साल्ट ट्रेडिङ',
      supplierInvoiceNo: supplierInvoiceNo || '',
      nepaliDate,
      reference: `Purchase Invoice: ${supplierInvoiceNo || 'General Restock'}`,
      performedBy: req.user._id,
      notes: notes || 'Stock-in restocking'
    });

    await AuditLog.create({
      action: 'STOCK_IN',
      module: 'INVENTORY',
      targetId: product._id.toString(),
      performedBy: req.user._id,
      details: { product: product.name, qty, prevStock, newStock, supplierName }
    });

    res.status(201).json({
      success: true,
      message: `Successfully restocked ${qty} ${product.unit} of ${product.name}`,
      product,
      stockEntry
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error recording stock-in'
    });
  }
};

// @desc    Record Stock-Out (Manual adjustment / Damaged / Transfer)
// @route   POST /api/inventory/stock-out
// @access  Private/Admin/Manager
export const recordStockOut = async (req, res) => {
  try {
    const { productId, quantity, reason, notes } = req.body;

    if (!productId || !quantity || Number(quantity) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide valid product and quantity'
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const qty = Number(quantity);
    if (product.currentStock < qty) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock. Current available stock is ${product.currentStock} ${product.unit}`
      });
    }

    const prevStock = product.currentStock;
    const newStock = prevStock - qty;

    product.currentStock = newStock;
    await product.save();

    const nepaliDate = getNepaliDate().formattedDevanagari;

    const stockEntry = await StockEntry.create({
      product: product._id,
      type: 'out',
      quantity: qty,
      previousStock: prevStock,
      newStock,
      unitPrice: product.pricePerUnit,
      totalAmount: qty * product.pricePerUnit,
      nepaliDate,
      reference: `Stock-Out: ${reason || 'Damaged / Adjustment'}`,
      performedBy: req.user._id,
      notes: notes || reason || 'Manual stock deduction'
    });

    await AuditLog.create({
      action: 'STOCK_OUT',
      module: 'INVENTORY',
      targetId: product._id.toString(),
      performedBy: req.user._id,
      details: { product: product.name, qty, prevStock, newStock, reason }
    });

    res.json({
      success: true,
      message: `Successfully deducted ${qty} ${product.unit} from ${product.name}`,
      product,
      stockEntry
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error recording stock deduction'
    });
  }
};

// @desc    Get complete Stock Ledger
// @route   GET /api/inventory/ledger
// @access  Private
export const getStockLedger = async (req, res) => {
  try {
    const { productId, type, startDate, endDate } = req.query;
    const filter = {};

    if (productId) {
      filter.product = productId;
    }

    if (type && type !== 'all') {
      filter.type = type;
    }

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const entries = await StockEntry.find(filter)
      .populate('product', 'name nameEnglish category unit pricePerUnit')
      .populate('performedBy', 'name role')
      .sort({ date: -1 })
      .limit(200);

    res.json({
      success: true,
      count: entries.length,
      entries
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching stock ledger'
    });
  }
};

// @desc    Get low stock alerts
// @route   GET /api/inventory/low-stock
// @access  Private
export const getLowStockAlerts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true });
    const lowStockProducts = products.filter(p => p.currentStock <= p.reorderLevel);

    res.json({
      success: true,
      count: lowStockProducts.length,
      lowStockProducts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching low stock alerts'
    });
  }
};
