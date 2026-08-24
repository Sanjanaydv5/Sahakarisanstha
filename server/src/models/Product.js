import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide product name'],
    trim: true
  },
  nameEnglish: {
    type: String,
    trim: true,
    default: ''
  },
  category: {
    type: String,
    enum: ['fertilizer', 'seed', 'pesticide', 'equipment', 'general'],
    default: 'fertilizer'
  },
  unit: {
    type: String,
    required: [true, 'Please provide unit (बोरा / केजी / प्याकेट / लिटर)'],
    default: 'बोरा (50 kg)'
  },
  currentStock: {
    type: Number,
    required: true,
    default: 0
  },
  reorderLevel: {
    type: Number,
    default: 10 // Alert when stock is <= 10
  },
  pricePerUnit: {
    type: Number,
    required: [true, 'Please provide selling price per unit'],
    default: 0
  },
  costPrice: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  description: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

export const Product = mongoose.model('Product', productSchema);
