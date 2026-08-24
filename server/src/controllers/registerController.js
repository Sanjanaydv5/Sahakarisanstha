import { SalesRegisterEntry } from '../models/SalesRegisterEntry.js';
import { OrgSettings } from '../models/OrgSettings.js';

// @desc    Get Government Fertilizer Distribution Register (मलको बिक्री वितरण विवरण - अनुसूची-३)
// @route   GET /api/register
// @access  Private
export const getDistributionRegister = async (req, res) => {
  try {
    const {
      farmer,
      fertilizerType,
      cropType,
      startDate,
      endDate,
      billDateBS,
      page = 1,
      limit = 100
    } = req.query;

    const filter = {};

    if (farmer) {
      filter.$or = [
        { farmerName: { $regex: farmer, $options: 'i' } },
        { phone: { $regex: farmer, $options: 'i' } },
        { idCardNo: { $regex: farmer, $options: 'i' } },
        { address: { $regex: farmer, $options: 'i' } }
      ];
    }

    if (fertilizerType && fertilizerType !== 'all') {
      filter.fertilizerType = { $regex: fertilizerType, $options: 'i' };
    }

    if (cropType && cropType !== 'all') {
      filter.cropType = { $regex: cropType, $options: 'i' };
    }

    if (billDateBS) {
      filter.billDateBS = { $regex: billDateBS, $options: 'i' };
    }

    if (startDate || endDate) {
      filter.billDateAD = {};
      if (startDate) filter.billDateAD.$gte = new Date(startDate);
      if (endDate) filter.billDateAD.$lte = new Date(endDate);
    }

    const entries = await SalesRegisterEntry.find(filter)
      .populate('performedBy', 'name role')
      .sort({ billNo: -1, createdAt: -1 });

    const totalQuantity = entries.reduce((sum, e) => sum + (e.quantity || 0), 0);
    const totalAmount = entries.reduce((sum, e) => sum + (e.salePrice || 0), 0);

    const settings = await OrgSettings.findOne();

    res.json({
      success: true,
      count: entries.length,
      totalQuantity,
      totalAmount,
      entries,
      orgSettings: settings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching distribution register'
    });
  }
};
