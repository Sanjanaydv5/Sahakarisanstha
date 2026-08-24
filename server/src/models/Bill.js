import mongoose from 'mongoose';

const billItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  description: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0.1
  },
  unit: {
    type: String,
    default: 'बोरा'
  },
  rate: {
    type: Number,
    required: true,
    min: 0
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  }
});

const billSchema = new mongoose.Schema({
  billNo: {
    type: Number,
    required: true,
    unique: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  nepaliDate: {
    type: String,
    required: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer'
  },
  buyerName: {
    type: String,
    required: [true, 'Please provide buyer name'],
    trim: true
  },
  buyerAddress: {
    type: String,
    default: 'लोहारपट्टी-२, महोत्तरी',
    trim: true
  },
  buyerPhone: {
    type: String,
    default: '',
    trim: true
  },
  buyerIdCardNo: {
    type: String,
    default: '',
    trim: true
  },
  areaRopaniKatta: {
    type: String,
    default: '५ कठ्ठा'
  },
  cropType: {
    type: String,
    default: 'धान / गहुँ'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'cheque', 'credit', 'other'],
    default: 'cash'
  },
  items: [billItemSchema],
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  advancePaid: {
    type: Number,
    default: 0,
    min: 0
  },
  balanceDue: {
    type: Number,
    default: 0,
    min: 0
  },
  amountInWordsNepali: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['paid', 'partial', 'due', 'void'],
    default: 'paid'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  voidReason: {
    type: String,
    default: ''
  },
  voidedBy: {
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

export const Bill = mongoose.model('Bill', billSchema);
