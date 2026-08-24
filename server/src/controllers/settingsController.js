import { OrgSettings } from '../models/OrgSettings.js';
import { AuditLog } from '../models/AuditLog.js';

// @desc    Get organization settings
// @route   GET /api/settings
// @access  Public / Authenticated
export const getSettings = async (req, res) => {
  try {
    let settings = await OrgSettings.findOne();
    if (!settings) {
      settings = await OrgSettings.create({});
    }
    res.json({
      success: true,
      settings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching org settings'
    });
  }
};

// @desc    Update organization settings (Admin only)
// @route   PUT /api/settings
// @access  Private/Admin
export const updateSettings = async (req, res) => {
  try {
    let settings = await OrgSettings.findOne();
    if (!settings) {
      settings = new OrgSettings();
    }

    const fields = [
      'nameNepali', 'nameEnglish', 'addressNepali', 'addressEnglish',
      'phones', 'registrationNo', 'panNo', 'panNoEnglish',
      'establishedYearBS', 'establishedUnder', 'billNumberPrefix',
      'nextBillNumber', 'dispatchPrefix', 'letterheadConfig'
    ];

    fields.forEach(field => {
      if (req.body[field] !== undefined) {
        settings[field] = req.body[field];
      }
    });

    await settings.save();

    await AuditLog.create({
      action: 'ORG_SETTINGS_UPDATED',
      module: 'SETTINGS',
      performedBy: req.user._id,
      details: req.body
    });

    res.json({
      success: true,
      message: 'Organization settings updated successfully',
      settings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating org settings'
    });
  }
};
