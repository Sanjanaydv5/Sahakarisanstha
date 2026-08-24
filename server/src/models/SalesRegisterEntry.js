import mongoose from 'mongoose';

const salesRegisterEntrySchema = new mongoose.Schema({
  farmerName: {
    type: String,
    required: true,
    trim: true
  },
  idCardNo: {
    type: String,
    trim: true,
    default: ''
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true,
    default: ''
  },
  areaRopaniKatta: {
    type: String,
    trim: true,
    default: '५ कठ्ठा'
  },
  fertilizerType: {
    type: String,
    required: true,
    trim: true
  },
  quantity: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    default: 'बोरा'
  },
  salePrice: {
    type: Number,
    required: true
  },
  billNo: {
    type: Number,
    required: true
  },
  billDateBS: {
    type: String,
    required: true
  },
  billDateAD: {
    type: Date,
    default: Date.now
  },
  cropType: {
    type: String,
    default: 'धान / गहुँ'
  },
  dispatchNo: {
    type: String,
    default: ''
  },
  billRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bill'
  },
  customerRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer'
  },
  productRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

export const SalesRegisterEntry = mongoose.model('SalesRegisterEntry', salesRegisterEntrySchema);
