import mongoose from 'mongoose';

const serviceTransactionSchema = new mongoose.Schema({
  serviceType: {
    type: String,
    enum: ['esewa', 'electricity', 'moneyTransfer', 'photocopy', 'printout'],
    required: true
  },
  customerName: {
    type: String,
    required: [true, 'Please provide customer name'],
    trim: true
  },
  customerPhone: {
    type: String,
    trim: true,
    default: ''
  },
  accountOrConsumerNo: {
    type: String,
    trim: true,
    default: ''
  },
  pagesOrQuantity: {
    type: Number,
    default: 1
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  serviceCharge: {
    type: Number,
    default: 0,
    min: 0
  },
  totalCollected: {
    type: Number,
    required: true,
    min: 0
  },
  date: {
    type: Date,
    default: Date.now
  },
  nepaliDate: {
    type: String,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

export const ServiceTransaction = mongoose.model('ServiceTransaction', serviceTransactionSchema);
