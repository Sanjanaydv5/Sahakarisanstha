import { Bill } from '../models/Bill.js';
import { Product } from '../models/Product.js';
import { Customer } from '../models/Customer.js';
import { OrgSettings } from '../models/OrgSettings.js';
import { StockEntry } from '../models/StockEntry.js';
import { SalesRegisterEntry } from '../models/SalesRegisterEntry.js';
import { AuditLog } from '../models/AuditLog.js';
import { getNepaliDate } from '../utils/nepaliDate.js';
import { numberToNepaliWords } from '../utils/numberToWordsNepali.js';

// @desc    Create a new Sales Bill
// @route   POST /api/bills
// @access  Private
export const createBill = async (req, res) => {
  try {
    const {
      buyerName,
      buyerAddress,
      buyerPhone,
      buyerIdCardNo,
      areaRopaniKatta,
      cropType,
      paymentMethod,
      items,
      advancePaid,
      notes
    } = req.body;

    if (!buyerName || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide buyer name and at least one item'
      });
    }

    // 1. Verify stock availability for all items with a product link
    for (const item of items) {
      if (item.product) {
        const prod = await Product.findById(item.product);
        if (!prod) {
          return res.status(400).json({
            success: false,
            message: `Product ${item.description || item.product} not found`
          });
        }
        if (prod.currentStock < item.quantity) {
          return res.status(400).json({
            success: false,
            message: `Insufficient stock for ${prod.name}. Available: ${prod.currentStock} ${prod.unit}, Requested: ${item.quantity}`
          });
        }
      }
    }

    // 2. Get and increment bill number atomically
    let settings = await OrgSettings.findOne();
    if (!settings) {
      settings = await OrgSettings.create({ nextBillNumber: 251 });
    }
    const billNo = settings.nextBillNumber || 251;
    settings.nextBillNumber = billNo + 1;
    await settings.save();

    // 3. Calculate totals
    const lineItems = items.map(item => {
      const qty = Number(item.quantity);
      const rate = Number(item.rate);
      const amount = Number(item.amount) || (qty * rate);
      return {
        product: item.product || null,
        description: item.description,
        quantity: qty,
        unit: item.unit || 'बोरा',
        rate,
        amount
      };
    });

    const totalAmount = lineItems.reduce((sum, item) => sum + item.amount, 0);
    const advance = Number(advancePaid) || 0;
    const balanceDue = Math.max(0, totalAmount - advance);

    let status = 'paid';
    if (balanceDue > 0 && advance > 0) {
      status = 'partial';
    } else if (balanceDue > 0 && advance === 0) {
      status = 'due';
    }

    // 4. Date formatting
    const nepaliDateObj = getNepaliDate();
    const nepaliDate = nepaliDateObj.formattedDevanagari;
    const amountInWords = numberToNepaliWords(totalAmount);

    // 5. Customer Record lookup / auto-create / balance update
    let customer = null;
    if (buyerPhone || buyerName) {
      customer = await Customer.findOne({
        $or: [
          ...(buyerPhone ? [{ phone: buyerPhone.trim() }] : []),
          { name: buyerName.trim() }
        ]
      });

      if (!customer) {
        customer = await Customer.create({
          name: buyerName.trim(),
          idCardNo: buyerIdCardNo || '',
          address: buyerAddress || 'लोहारपट्टी-२, महोत्तरी',
          phone: buyerPhone || '',
          area: areaRopaniKatta || '५ कठ्ठा',
          cropType: cropType || 'धान / गहुँ',
          outstandingBalance: balanceDue,
          totalPurchases: totalAmount,
          createdBy: req.user._id
        });
      } else {
        customer.totalPurchases = (customer.totalPurchases || 0) + totalAmount;
        customer.outstandingBalance = (customer.outstandingBalance || 0) + balanceDue;
        if (buyerIdCardNo && !customer.idCardNo) customer.idCardNo = buyerIdCardNo;
        if (areaRopaniKatta) customer.area = areaRopaniKatta;
        if (cropType) customer.cropType = cropType;
        await customer.save();
      }
    }

    // 6. Create Bill
    const bill = await Bill.create({
      billNo,
      date: new Date(),
      nepaliDate,
      customer: customer ? customer._id : null,
      buyerName: buyerName.trim(),
      buyerAddress: buyerAddress || 'लोहारपट्टी-२, महोत्तरी',
      buyerPhone: buyerPhone || '',
      buyerIdCardNo: buyerIdCardNo || (customer ? customer.idCardNo : ''),
      areaRopaniKatta: areaRopaniKatta || '५ कठ्ठा',
      cropType: cropType || 'धान / गहुँ',
      paymentMethod: paymentMethod || 'cash',
      items: lineItems,
      totalAmount,
      advancePaid: advance,
      balanceDue,
      amountInWordsNepali: amountInWords,
      status,
      createdBy: req.user._id,
      notes: notes || ''
    });

    // 7. Auto-deduct inventory & create StockEntry + SalesRegisterEntry
    for (const item of lineItems) {
      if (item.product) {
        const prod = await Product.findById(item.product);
        if (prod) {
          const prevStock = prod.currentStock;
          const newStock = Math.max(0, prevStock - item.quantity);
          prod.currentStock = newStock;
          await prod.save();

          // Log Stock deduction
          await StockEntry.create({
            product: prod._id,
            type: 'out',
            quantity: item.quantity,
            previousStock: prevStock,
            newStock,
            unitPrice: item.rate,
            totalAmount: item.amount,
            nepaliDate,
            reference: `Sale Bill #${billNo}`,
            billRef: bill._id,
            performedBy: req.user._id,
            notes: `Sold to ${buyerName}`
          });
        }
      }

      // Create Sales Register Entry (मलको बिक्री वितरण विवरण अनुसूची-३)
      await SalesRegisterEntry.create({
        farmerName: buyerName.trim(),
        idCardNo: buyerIdCardNo || (customer ? customer.idCardNo : ''),
        address: buyerAddress || 'लोहारपट्टी-२, महोत्तरी',
        phone: buyerPhone || '',
        areaRopaniKatta: areaRopaniKatta || '५ कठ्ठा',
        fertilizerType: item.description,
        quantity: item.quantity,
        unit: item.unit || 'बोरा',
        salePrice: item.amount,
        billNo,
        billDateBS: nepaliDate,
        billDateAD: new Date(),
        cropType: cropType || 'धान / गहुँ',
        dispatchNo: `${settings.dispatchPrefix || 'चलानी-'}${billNo}`,
        billRef: bill._id,
        customerRef: customer ? customer._id : null,
        productRef: item.product || null,
        performedBy: req.user._id
      });
    }

    // 8. Log Audit
    await AuditLog.create({
      action: 'BILL_CREATED',
      module: 'BILLING',
      targetId: bill._id.toString(),
      performedBy: req.user._id,
      details: { billNo, buyerName, totalAmount, balanceDue, status }
    });

    // Populate and return
    const populatedBill = await Bill.findById(bill._id)
      .populate('createdBy', 'name role')
      .populate('customer');

    res.status(201).json({
      success: true,
      message: `Bill #${billNo} generated successfully`,
      bill: populatedBill,
      orgSettings: settings
    });
  } catch (error) {
    console.error('Error creating bill:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error generating bill'
    });
  }
};

// @desc    Get all bills with filtering & search
// @route   GET /api/bills
// @access  Private
export const getBills = async (req, res) => {
  try {
    const { search, status, paymentMethod, startDate, endDate, createdBy } = req.query;
    const filter = {};

    // If staff, only show their own bills (as per requirements spec)
    if (req.user.role === 'staff') {
      filter.createdBy = req.user._id;
    } else if (createdBy) {
      filter.createdBy = createdBy;
    }

    if (search) {
      const isNum = !isNaN(search);
      filter.$or = [
        ...(isNum ? [{ billNo: Number(search) }] : []),
        { buyerName: { $regex: search, $options: 'i' } },
        { buyerPhone: { $regex: search, $options: 'i' } },
        { buyerAddress: { $regex: search, $options: 'i' } },
        { nepaliDate: { $regex: search, $options: 'i' } }
      ];
    }

    if (status && status !== 'all') {
      filter.status = status;
    }

    if (paymentMethod && paymentMethod !== 'all') {
      filter.paymentMethod = paymentMethod;
    }

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const bills = await Bill.find(filter)
      .populate('createdBy', 'name role')
      .populate('customer', 'name phone area outstandingBalance')
      .sort({ billNo: -1 });

    const totalSalesAmount = bills
      .filter(b => b.status !== 'void')
      .reduce((sum, b) => sum + b.totalAmount, 0);

    const totalDuesAmount = bills
      .filter(b => b.status !== 'void')
      .reduce((sum, b) => sum + b.balanceDue, 0);

    res.json({
      success: true,
      count: bills.length,
      totalSalesAmount,
      totalDuesAmount,
      bills
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching bills'
    });
  }
};

// @desc    Get single bill by ID
// @route   GET /api/bills/:id
// @access  Private
export const getBillById = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id)
      .populate('createdBy', 'name role username phone')
      .populate('customer')
      .populate('items.product');

    if (!bill) {
      return res.status(404).json({
        success: false,
        message: 'Bill not found'
      });
    }

    // If staff, verify ownership
    if (req.user.role === 'staff' && bill.createdBy._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view other staff members bills'
      });
    }

    const settings = await OrgSettings.findOne();

    res.json({
      success: true,
      bill,
      orgSettings: settings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching bill'
    });
  }
};

// @desc    Void/Cancel a Bill (Admin/Manager only)
// @route   PUT /api/bills/:id/void
// @access  Private/Admin/Manager
export const voidBill = async (req, res) => {
  try {
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a reason for voiding this bill'
      });
    }

    const bill = await Bill.findById(req.params.id);
    if (!bill) {
      return res.status(404).json({
        success: false,
        message: 'Bill not found'
      });
    }

    if (bill.status === 'void') {
      return res.status(400).json({
        success: false,
        message: 'This bill is already voided'
      });
    }

    // 1. Restore product stock
    for (const item of bill.items) {
      if (item.product) {
        const prod = await Product.findById(item.product);
        if (prod) {
          const prevStock = prod.currentStock;
          const newStock = prevStock + item.quantity;
          prod.currentStock = newStock;
          await prod.save();

          await StockEntry.create({
            product: prod._id,
            type: 'in',
            quantity: item.quantity,
            previousStock: prevStock,
            newStock,
            unitPrice: item.rate,
            totalAmount: item.amount,
            nepaliDate: getNepaliDate().formattedDevanagari,
            reference: `Reversal of Voided Bill #${bill.billNo}`,
            billRef: bill._id,
            performedBy: req.user._id,
            notes: `Bill #${bill.billNo} voided: ${reason}`
          });
        }
      }
    }

    // 2. Adjust Customer outstanding balance & total purchases
    if (bill.customer) {
      const customer = await Customer.findById(bill.customer);
      if (customer) {
        customer.totalPurchases = Math.max(0, (customer.totalPurchases || 0) - bill.totalAmount);
        customer.outstandingBalance = Math.max(0, (customer.outstandingBalance || 0) - bill.balanceDue);
        await customer.save();
      }
    }

    // 3. Mark Bill as Void
    bill.status = 'void';
    bill.voidReason = reason;
    bill.voidedBy = req.user._id;
    await bill.save();

    // 4. Delete or mark corresponding SalesRegisterEntry
    await SalesRegisterEntry.deleteMany({ billRef: bill._id });

    // 5. Audit Log
    await AuditLog.create({
      action: 'BILL_VOIDED',
      module: 'BILLING',
      targetId: bill._id.toString(),
      performedBy: req.user._id,
      details: { billNo: bill.billNo, reason, amount: bill.totalAmount }
    });

    res.json({
      success: true,
      message: `Bill #${bill.billNo} has been successfully voided and stock restored`,
      bill
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error voiding bill'
    });
  }
};
