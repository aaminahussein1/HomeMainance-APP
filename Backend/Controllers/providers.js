const ServiceProvider = require('../models/ServiceProvider');


exports.registerProvider = async (req, res) => {
  try {
    console.log('Body:', req.body);
    console.log('Files:', req.files);
    
    const providerData = {
      ...req.body,
      profileImage: req.files?.profileImage?.[0]?.path || null,
      documents: req.files?.documents?.map(file => file.path) || []
    };

    const provider = await ServiceProvider.create(providerData);
    
    res.status(201).json({
      success: true,
      message: 'Service provider registered successfully',
      data: provider
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};


exports.getProviders = async (req, res) => {
  try {
    const providers = await ServiceProvider.find({ status: 'approved' });
    res.json({
      success: true,
      count: providers.length,
      data: providers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


exports.getProviderById = async (req, res) => {
  try {
    const provider = await ServiceProvider.findById(req.params.id);
    
    if (!provider) {
      return res.status(404).json({
        success: false,
        message: 'Provider not found'
      });
    }
    
    res.json({
      success: true,
      data: provider
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


exports.updateProfile = async (req, res) => {
  try {
    const provider = await ServiceProvider.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!provider) {
      return res.status(404).json({
        success: false,
        message: 'Provider not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: provider
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};


exports.updateAvailability = async (req, res) => {
  try {
    const provider = await ServiceProvider.findByIdAndUpdate(
      req.params.id,
      { availability: req.body.availability },
      { new: true }
    );
    
    if (!provider) {
      return res.status(404).json({
        success: false,
        message: 'Provider not found'
      });
    }
    
    res.json({
      success: true,
      message: `Availability updated to ${req.body.availability}`,
      data: provider
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};


exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatus = ['pending', 'approved', 'blocked'];
    
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Allowed: pending, approved, blocked'
      });
    }
    
    const provider = await ServiceProvider.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    if (!provider) {
      return res.status(404).json({
        success: false,
        message: 'Provider not found'
      });
    }
    
    res.json({
      success: true,
      message: `Status updated to ${status}`,
      data: provider
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};