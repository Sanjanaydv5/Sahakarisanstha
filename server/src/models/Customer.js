import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide customer/farmer name'],
    trim: true
  },
  idCardNo: {
    type: String,
    trim: true,
    default: ''
  },
  address: {
    type: String,
    required: [true, 'Please provide address'],
    trim: true,
    default: 'लोहारपट्टी-२, महोत्तरी'
  },
  phone: {
    type: String,
    trim: true,
    default: ''
  },
  area: {
    type: String,
    trim: true,
    default: '५ कठ्ठा' // Land size (रोपनी / कठ्ठा / विघा)
  },
  cropType: {
    type: String,
    trim: true,
    default: 'धान / गहुँ' // Default primary crop
  },
  outstandingBalance: {
    type: Number,
    default: 0
  },
  totalPurchases: {
    type: Number,
    default: 0
  },
  createdBy: {
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

export const Customer = mongoose.model('Customer', customerSchema);
