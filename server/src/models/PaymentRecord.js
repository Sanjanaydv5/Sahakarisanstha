import mongoose from 'mongoose';

const paymentRecordSchema = new mongoose.Schema({
  receiptNo: {
    type: Number,
    required: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  bill: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bill'
  },
  amountPaid: {
    type: Number,
    required: true,
    min: 1
  },
  previousDue: {
    type: Number,
    required: true
  },
  remainingDue: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'esewa', 'bank_transfer', 'cheque'],
    default: 'cash'
  },
  paymentDate: {
    type: Date,
    default: Date.now
  },
  nepaliDate: {
    type: String,
    required: true
  },
  receivedBy: {
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

export const PaymentRecord = mongoose.model('PaymentRecord', paymentRecordSchema);
