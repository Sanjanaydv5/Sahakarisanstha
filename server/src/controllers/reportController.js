import { Bill } from '../models/Bill.js';
import { Product } from '../models/Product.js';
import { Customer } from '../models/Customer.js';
import { ServiceTransaction } from '../models/ServiceTransaction.js';
import { PaymentRecord } from '../models/PaymentRecord.js';
import { User } from '../models/User.js';

// @desc    Admin Dashboard Analytics & Metrics
// @route   GET /api/reports/admin-dashboard
// @access  Private/Admin
export const getAdminDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 1. Goods Sales Stats
    const allBills = await Bill.find({ status: { $ne: 'void' } });
    const totalSalesRevenue = allBills.reduce((sum, b) => sum + b.totalAmount, 0);
    const totalBillsCount = allBills.length;
    const totalDuesOutstanding = allBills.reduce((sum, b) => sum + b.balanceDue, 0);

    // Today's Sales
    const todayBills = allBills.filter(b => new Date(b.date) >= today);
    const todaySalesRevenue = todayBills.reduce((sum, b) => sum + b.totalAmount, 0);

    // 2. Services Stats
    const allServices = await ServiceTransaction.find();
    const totalServiceCommissions = allServices.reduce((sum, s) => sum + (s.serviceCharge || 0), 0);
    const totalServiceVolume = allServices.reduce((sum, s) => sum + (s.amount || 0), 0);

    const todayServices = allServices.filter(s => new Date(s.date) >= today);
    const todayServiceCommissions = todayServices.reduce((sum, s) => sum + (s.serviceCharge || 0), 0);

    // 3. Inventory Stats
    const products = await Product.find({ isActive: true });
    const totalStockValue = products.reduce((sum, p) => sum + (p.currentStock * p.pricePerUnit), 0);
    const lowStockAlerts = products.filter(p => p.currentStock <= p.reorderLevel);

    // 4. Customer stats
    const totalCustomers = await Customer.countDocuments();
    const customersWithDues = await Customer.countDocuments({ outstandingBalance: { $gt: 0 } });

    // 5. Recent 7 Days Trend
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      const nextD = new Date(d);
      nextD.setDate(nextD.getDate() + 1);

      const dayBills = allBills.filter(b => new Date(b.date) >= d && new Date(b.date) < nextD);
      const daySales = dayBills.reduce((sum, b) => sum + b.totalAmount, 0);

      const dayServices = allServices.filter(s => new Date(s.date) >= d && new Date(s.date) < nextD);
      const dayCommissions = dayServices.reduce((sum, s) => sum + (s.serviceCharge || 0), 0);

      const dayName = d.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' });
      last7Days.push({
        date: dayName,
        sales: daySales,
        services: dayCommissions,
        total: daySales + dayCommissions
      });
    }

    // 6. Top Selling Products
    const productSalesMap = {};
    allBills.forEach(b => {
      b.items.forEach(item => {
        const name = item.description;
        if (!productSalesMap[name]) {
          productSalesMap[name] = { name, quantity: 0, revenue: 0 };
        }
        productSalesMap[name].quantity += item.quantity;
        productSalesMap[name].revenue += item.amount;
      });
    });

    const topProducts = Object.values(productSalesMap)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // 7. Recent Transactions
    const recentBills = await Bill.find()
      .populate('createdBy', 'name role')
      .sort({ billNo: -1 })
      .limit(6);

    res.json({
      success: true,
      stats: {
        totalRevenue: totalSalesRevenue + totalServiceCommissions,
        totalSalesRevenue,
        todaySalesRevenue,
        totalBillsCount,
        todayBillsCount: todayBills.length,
        totalServiceCommissions,
        todayServiceCommissions,
        totalStockValue,
        totalDuesOutstanding,
        totalCustomers,
        customersWithDues,
        lowStockCount: lowStockAlerts.length
      },
      charts: {
        salesTrend: last7Days,
        topProducts
      },
      lowStockAlerts: lowStockAlerts.slice(0, 5),
      recentBills
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error generating admin dashboard'
    });
  }
};

// @desc    Manager Dashboard
// @route   GET /api/reports/manager-dashboard
// @access  Private/Manager/Admin
export const getManagerDashboardStats = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true }).sort({ currentStock: 1 });
    const lowStockAlerts = products.filter(p => p.currentStock <= p.reorderLevel);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayBills = await Bill.find({
      date: { $gte: today },
      status: { $ne: 'void' }
    }).populate('createdBy', 'name');

    const todaySales = todayBills.reduce((sum, b) => sum + b.totalAmount, 0);

    const duesSummary = await Customer.aggregate([
      { $match: { outstandingBalance: { $gt: 0 } } },
      { $group: { _id: null, totalDue: { $sum: '$outstandingBalance' }, count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      inventorySummary: {
        totalProducts: products.length,
        lowStockCount: lowStockAlerts.length,
        lowStockList: lowStockAlerts
      },
      todayActivity: {
        todaySales,
        todayBillsCount: todayBills.length,
        bills: todayBills
      },
      duesOverview: {
        totalDue: duesSummary[0]?.totalDue || 0,
        farmersCount: duesSummary[0]?.count || 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error generating manager dashboard'
    });
  }
};

// @desc    Staff Dashboard
// @route   GET /api/reports/staff-dashboard
// @access  Private
export const getStaffDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const myBillsToday = await Bill.find({
      createdBy: req.user._id,
      date: { $gte: today }
    }).sort({ billNo: -1 });

    const mySalesToday = myBillsToday
      .filter(b => b.status !== 'void')
      .reduce((sum, b) => sum + b.totalAmount, 0);

    const myCashCollectedToday = myBillsToday
      .filter(b => b.status !== 'void')
      .reduce((sum, b) => sum + (b.advancePaid || (b.paymentMethod === 'cash' ? b.totalAmount : 0)), 0);

    const myServicesToday = await ServiceTransaction.find({
      createdBy: req.user._id,
      date: { $gte: today }
    }).sort({ date: -1 });

    const myServicesVolume = myServicesToday.reduce((sum, s) => sum + s.amount, 0);
    const myServicesCommission = myServicesToday.reduce((sum, s) => sum + s.serviceCharge, 0);

    res.json({
      success: true,
      stats: {
        todayBillsCount: myBillsToday.length,
        todaySales: mySalesToday,
        todayCashCollected: myCashCollectedToday,
        todayServicesCount: myServicesToday.length,
        todayServicesVolume: myServicesVolume,
        todayServicesCommission: myServicesCommission
      },
      recentBills: myBillsToday.slice(0, 5),
      recentServices: myServicesToday.slice(0, 5)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error generating staff dashboard'
    });
  }
};

// @desc    Daily Cash Closing & Drawer Reconciliation
// @route   GET /api/reports/daily-closing
// @access  Private
export const getDailyCashClosing = async (req, res) => {
  try {
    const { date } = req.query;
    const targetDate = date ? new Date(date) : new Date();
    targetDate.setHours(0, 0, 0, 0);

    const nextDate = new Date(targetDate);
    nextDate.setDate(nextDate.getDate() + 1);

    // 1. Cash from Bills
    const bills = await Bill.find({
      date: { $gte: targetDate, $lt: nextDate },
      status: { $ne: 'void' }
    }).populate('createdBy', 'name');

    let cashFromSales = 0;
    let chequeFromSales = 0;
    let creditFromSales = 0;

    bills.forEach(b => {
      if (b.paymentMethod === 'cash') cashFromSales += (b.advancePaid > 0 ? b.advancePaid : b.totalAmount);
      if (b.paymentMethod === 'cheque') chequeFromSales += b.totalAmount;
      if (b.paymentMethod === 'credit' || b.balanceDue > 0) creditFromSales += b.balanceDue;
    });

    // 2. Cash from Services
    const services = await ServiceTransaction.find({
      date: { $gte: targetDate, $lt: nextDate }
    }).populate('createdBy', 'name');

    const cashFromServices = services.reduce((sum, s) => sum + s.totalCollected, 0);
    const serviceCommissions = services.reduce((sum, s) => sum + s.serviceCharge, 0);

    // 3. Cash from Dues Repayments
    const repayments = await PaymentRecord.find({
      paymentDate: { $gte: targetDate, $lt: nextDate },
      paymentMethod: 'cash'
    }).populate('customer', 'name');

    const cashFromRepayments = repayments.reduce((sum, p) => sum + p.amountPaid, 0);

    const totalCashInDrawer = cashFromSales + cashFromServices + cashFromRepayments;

    res.json({
      success: true,
      closingDate: targetDate.toISOString().split('T')[0],
      summary: {
        totalCashInDrawer,
        cashFromSales,
        chequeFromSales,
        creditFromSales,
        cashFromServices,
        serviceCommissions,
        cashFromRepayments
      },
      breakdown: {
        billsCount: bills.length,
        servicesCount: services.length,
        repaymentsCount: repayments.length
      },
      bills,
      services,
      repayments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error generating daily closing'
    });
  }
};
