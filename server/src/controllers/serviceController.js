import { ServiceTransaction } from '../models/ServiceTransaction.js';
import { AuditLog } from '../models/AuditLog.js';
import { getNepaliDate } from '../utils/nepaliDate.js';

// @desc    Record a new utility or financial service transaction
// @route   POST /api/services
// @access  Private
export const createServiceTransaction = async (req, res) => {
  try {
    const {
      serviceType,
      customerName,
      customerPhone,
      accountOrConsumerNo,
      pagesOrQuantity,
      amount,
      serviceCharge,
      notes
    } = req.body;

    if (!serviceType || !customerName || amount === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide service type, customer name, and amount'
      });
    }

    const principalAmount = Number(amount) || 0;
    const fee = Number(serviceCharge) || 0;
    const totalCollected = principalAmount + fee;
    const nepaliDate = getNepaliDate().formattedDevanagari;

    const transaction = await ServiceTransaction.create({
      serviceType,
      customerName: customerName.trim(),
      customerPhone: customerPhone ? customerPhone.trim() : '',
      accountOrConsumerNo: accountOrConsumerNo ? accountOrConsumerNo.trim() : '',
      pagesOrQuantity: Number(pagesOrQuantity) || 1,
      amount: principalAmount,
      serviceCharge: fee,
      totalCollected,
      nepaliDate,
      createdBy: req.user._id,
      notes: notes || ''
    });

    await AuditLog.create({
      action: 'SERVICE_TRANSACTION_RECORDED',
      module: 'SERVICES',
      targetId: transaction._id.toString(),
      performedBy: req.user._id,
      details: { serviceType, customerName, totalCollected, serviceCharge: fee }
    });

    const populatedTxn = await ServiceTransaction.findById(transaction._id)
      .populate('createdBy', 'name role');

    res.status(201).json({
      success: true,
      message: `${serviceType.toUpperCase()} service recorded successfully`,
      transaction: populatedTxn
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error recording service transaction'
    });
  }
};

// @desc    Get all service transactions with filters
// @route   GET /api/services
// @access  Private
export const getServiceTransactions = async (req, res) => {
  try {
    const { serviceType, search, startDate, endDate } = req.query;
    const filter = {};

    // If staff, show their transactions
    if (req.user.role === 'staff') {
      filter.createdBy = req.user._id;
    }

    if (serviceType && serviceType !== 'all') {
      filter.serviceType = serviceType;
    }

    if (search) {
      filter.$or = [
        { customerName: { $regex: search, $options: 'i' } },
        { customerPhone: { $regex: search, $options: 'i' } },
        { accountOrConsumerNo: { $regex: search, $options: 'i' } },
        { nepaliDate: { $regex: search, $options: 'i' } }
      ];
    }

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const transactions = await ServiceTransaction.find(filter)
      .populate('createdBy', 'name role')
      .sort({ date: -1 });

    const totalTransacted = transactions.reduce((sum, t) => sum + (t.amount || 0), 0);
    const totalCommissionsEarned = transactions.reduce((sum, t) => sum + (t.serviceCharge || 0), 0);
    const totalCashCollected = transactions.reduce((sum, t) => sum + (t.totalCollected || 0), 0);

    // Grouping by service type
    const byType = {
      esewa: { count: 0, amount: 0, commission: 0 },
      electricity: { count: 0, amount: 0, commission: 0 },
      moneyTransfer: { count: 0, amount: 0, commission: 0 },
      photocopy: { count: 0, amount: 0, commission: 0 },
      printout: { count: 0, amount: 0, commission: 0 }
    };

    transactions.forEach(t => {
      if (byType[t.serviceType]) {
        byType[t.serviceType].count += 1;
        byType[t.serviceType].amount += t.amount || 0;
        byType[t.serviceType].commission += t.serviceCharge || 0;
      }
    });

    res.json({
      success: true,
      count: transactions.length,
      totalTransacted,
      totalCommissionsEarned,
      totalCashCollected,
      byType,
      transactions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching service transactions'
    });
  }
};
