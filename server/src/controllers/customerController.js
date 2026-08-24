import { Customer } from '../models/Customer.js';
import { Bill } from '../models/Bill.js';
import { PaymentRecord } from '../models/PaymentRecord.js';

// @desc    Get all customers with search and pagination
// @route   GET /api/customers
// @access  Private
export const getCustomers = async (req, res) => {
  try {
    const { search, area, crop, hasDues } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { idCardNo: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } }
      ];
    }

    if (area) {
      filter.area = { $regex: area, $options: 'i' };
    }

    if (crop) {
      filter.cropType = { $regex: crop, $options: 'i' };
    }

    if (hasDues === 'true') {
      filter.outstandingBalance = { $gt: 0 };
    }

    const customers = await Customer.find(filter)
      .sort({ outstandingBalance: -1, name: 1 });

    const totalDuesSum = customers.reduce((sum, c) => sum + (c.outstandingBalance || 0), 0);

    res.json({
      success: true,
      count: customers.length,
      totalDues: totalDuesSum,
      customers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching customers'
    });
  }
};

// @desc    Get single customer by ID with history
// @route   GET /api/customers/:id
// @access  Private
export const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer/Farmer not found'
      });
    }

    // Fetch related bills
    const bills = await Bill.find({
      $or: [
        { customer: customer._id },
        { buyerName: customer.name }
      ]
    }).sort({ date: -1 });

    // Fetch payment records
    const payments = await PaymentRecord.find({
      customer: customer._id
    }).sort({ paymentDate: -1 });

    res.json({
      success: true,
      customer,
      bills,
      payments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching customer profile'
    });
  }
};

// @desc    Create new customer / farmer
// @route   POST /api/customers
// @access  Private
export const createCustomer = async (req, res) => {
  try {
    const { name, idCardNo, address, phone, area, cropType, notes } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Customer name is required'
      });
    }

    const customer = await Customer.create({
      name,
      idCardNo: idCardNo || '',
      address: address || 'लोहारपट्टी-२, महोत्तरी',
      phone: phone || '',
      area: area || '५ कठ्ठा',
      cropType: cropType || 'धान / गहुँ',
      notes: notes || '',
      createdBy: req.user._id
    });

    res.status(201).json({
      success: true,
      message: 'Farmer/Customer added successfully',
      customer
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error adding customer'
    });
  }
};

// @desc    Update customer
// @route   PUT /api/customers/:id
// @access  Private
export const updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    const fields = ['name', 'idCardNo', 'address', 'phone', 'area', 'cropType', 'notes'];
    fields.forEach(field => {
      if (req.body[field] !== undefined) {
        customer[field] = req.body[field];
      }
    });

    await customer.save();

    res.json({
      success: true,
      message: 'Customer details updated successfully',
      customer
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating customer'
    });
  }
};
