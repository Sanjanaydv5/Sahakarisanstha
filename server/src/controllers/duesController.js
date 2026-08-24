import { Customer } from '../models/Customer.js';
import { Bill } from '../models/Bill.js';
import { PaymentRecord } from '../models/PaymentRecord.js';
import { AuditLog } from '../models/AuditLog.js';
import { getNepaliDate } from '../utils/nepaliDate.js';

// @desc    Get all customers with outstanding dues
// @route   GET /api/dues
// @access  Private
export const getDuesSummary = async (req, res) => {
  try {
    const { search, area } = req.query;
    const filter = { outstandingBalance: { $gt: 0 } };

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

    const customersWithDues = await Customer.find(filter)
      .sort({ outstandingBalance: -1 });

    const totalOutstandingDues = customersWithDues.reduce((sum, c) => sum + c.outstandingBalance, 0);

    // Also get due/partial bills
    const dueBills = await Bill.find({
      status: { $in: ['due', 'partial'] }
    }).sort({ date: -1 });

    res.json({
      success: true,
      count: customersWithDues.length,
      totalOutstandingDues,
      customers: customersWithDues,
      dueBills
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching dues summary'
    });
  }
};

// @desc    Record a credit/dues payment
// @route   POST /api/dues/pay
// @access  Private
export const recordDuePayment = async (req, res) => {
  try {
    const {
      customerId,
      billId,
      amountPaid,
      paymentMethod,
      notes
    } = req.body;

    if (!customerId || !amountPaid || Number(amountPaid) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide customer ID and valid payment amount'
      });
    }

    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    const paymentAmount = Number(amountPaid);
    const prevDue = customer.outstandingBalance || 0;
    const remainingDue = Math.max(0, prevDue - paymentAmount);

    customer.outstandingBalance = remainingDue;
    await customer.save();

    // If billId provided, adjust that specific bill
    let bill = null;
    if (billId) {
      bill = await Bill.findById(billId);
      if (bill) {
        bill.advancePaid = (bill.advancePaid || 0) + paymentAmount;
        bill.balanceDue = Math.max(0, bill.totalAmount - bill.advancePaid);
        if (bill.balanceDue === 0) {
          bill.status = 'paid';
        } else {
          bill.status = 'partial';
        }
        await bill.save();
      }
    }

    const receiptNo = Date.now().toString().slice(-6);
    const nepaliDate = getNepaliDate().formattedDevanagari;

    const paymentRecord = await PaymentRecord.create({
      receiptNo: Number(receiptNo),
      customer: customer._id,
      bill: bill ? bill._id : null,
      amountPaid: paymentAmount,
      previousDue: prevDue,
      remainingDue,
      paymentMethod: paymentMethod || 'cash',
      nepaliDate,
      receivedBy: req.user._id,
      notes: notes || `Dues payment received from ${customer.name}`
    });

    await AuditLog.create({
      action: 'DUE_PAYMENT_RECORDED',
      module: 'DUES',
      targetId: paymentRecord._id.toString(),
      performedBy: req.user._id,
      details: { customerName: customer.name, amountPaid: paymentAmount, remainingDue }
    });

    const populatedPayment = await PaymentRecord.findById(paymentRecord._id)
      .populate('customer', 'name phone address')
      .populate('receivedBy', 'name role');

    res.status(201).json({
      success: true,
      message: `Payment of रु. ${paymentAmount} recorded successfully. Remaining balance: रु. ${remainingDue}`,
      payment: populatedPayment,
      customer
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error recording dues payment'
    });
  }
};

// @desc    Get payment history
// @route   GET /api/dues/payments
// @access  Private
export const getPaymentHistory = async (req, res) => {
  try {
    const { customerId, startDate, endDate } = req.query;
    const filter = {};

    if (customerId) {
      filter.customer = customerId;
    }

    if (startDate || endDate) {
      filter.paymentDate = {};
      if (startDate) filter.paymentDate.$gte = new Date(startDate);
      if (endDate) filter.paymentDate.$lte = new Date(endDate);
    }

    const payments = await PaymentRecord.find(filter)
      .populate('customer', 'name phone address')
      .populate('receivedBy', 'name role')
      .populate('bill', 'billNo totalAmount')
      .sort({ paymentDate: -1 });

    const totalCollected = payments.reduce((sum, p) => sum + p.amountPaid, 0);

    res.json({
      success: true,
      count: payments.length,
      totalCollected,
      payments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching payment history'
    });
  }
};
