import mongoose from 'mongoose';

const stockEntrySchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  type: {
    type: String,
    enum: ['in', 'out', 'adjustment'],
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  previousStock: {
    type: Number,
    required: true
  },
  newStock: {
    type: Number,
    required: true
  },
  unitPrice: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    default: 0
  },
  supplierName: {
    type: String,
    default: ''
  },
  supplierInvoiceNo: {
    type: String,
    default: ''
  },
  date: {
    type: Date,
    default: Date.now
  },
  nepaliDate: {
    type: String,
    default: ''
  },
  reference: {
    type: String,
    default: ''
  },
  billRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bill'
  },
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

export const StockEntry = mongoose.model('StockEntry', stockEntrySchema);
