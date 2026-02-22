import jwt from 'jsonwebtoken';
import { User, Provider } from '../models/User.js';
import Service from '../models/Service.js'; 

// 1. Diiwaangelinta (Register)
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, role, serviceType, location, serviceId, bio } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'Email-kan hore ayaa loo diiwaangeliyey' });
    }

    // --- WAXA KA DHIMNAA ---
    // User model-ka laftiisa waa inuu kaydiyaa serviceType si uu ugu muuqdo profile-ka
    const user = await User.create({
      name,
      email,
      password, 
      phone,
      location: location || "",
      bio: bio || "",
      role: role || 'customer',
      serviceType: role === 'provider' ? serviceType : "Customer"
    });

    if (user && role === 'provider') {
      let finalServiceId = serviceId; 

      // Haddii serviceId uusan frontend-ka ka imaan, magaca ku raadi
      if (!finalServiceId && serviceType) {
        const foundService = await Service.findOne({ 
          name: { $regex: new RegExp(`^${serviceType}$`, 'i') } 
        });
        if (foundService) {
          finalServiceId = foundService._id;
        }
      }

      // --- WAXA KA DHIMNAA ---
      // Provider model-ka waa inuu si sax ah u kaydiyaa xogtan si ay u muuqato directory-ga
      await Provider.create({
        user: user._id,
        fullName: name,
        serviceType: serviceType, // Halkan ayuu ka qaadayaa doorashadii Nasra
        serviceId: finalServiceId, 
        location: location || 'Lama cayimin',
        bio: bio || "",
        status: 'approved' 
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "fallback_secret_123", { expiresIn: '30d' });

    res.status(201).json({
      success: true,
      token,
      user: { 
        _id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role,
        serviceType: user.serviceType 
      }
    });

  } catch (error) {
    console.error('🔥 Register Error:', error.message);
    res.status(500).json({ success: false, message: 'Cillad farsamo: ' + error.message });
  }
};

// 2. Soo gelidda (Login) 
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    // matchPassword waa magaca aan ugu soo darray User model-ka si uu controller-kaaga u shaqeeyo
    if (user && (await user.matchPassword(password))) { 
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "fallback_secret_123", { expiresIn: '30d' });

      res.json({
        success: true,
        token,
        user: { 
          _id: user._id, 
          name: user.name, 
          email: user.email, 
          role: user.role,
          serviceType: user.serviceType 
        }
      });
    } else {
      res.status(401).json({ success: false, message: 'Email ama Password khaldan' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server-ka ayaa cillad la kulmay' });
  }
};

// 3. Helitaanka dhammaan Khubarada (List View)
export const getAllProviders = async (req, res) => {
  try {
    const { serviceId, serviceType } = req.query; 
    let filter = {};
    
    // Halkan ayaan u saxnay si search-ku u shaqeeyo (Sawirka 1-aad xalkiisa)
    if (serviceId && serviceId !== 'null' && serviceId !== 'undefined') {
      filter.$or = [
        { serviceId: serviceId },
        { serviceType: serviceType } 
      ];
    } else if (serviceType) {
       filter.serviceType = { $regex: new RegExp(serviceType, 'i') };
    }

    const providers = await Provider.find(filter).populate({
      path: 'user',
      select: 'name email phone role'
    });

    const formattedProviders = providers.map(p => {
      if (!p.user) return null;
      return {
        _id: p.user._id, 
        name: p.fullName || p.user.name,
        email: p.user.email,
        phone: p.user.phone,
        location: p.location,
        serviceType: p.serviceType, 
        serviceId: p.serviceId,
        status: p.status
      };
    }).filter(p => p !== null);

    res.json({ success: true, data: formattedProviders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 4. Helitaanka hal Provider (Profile View)
export const getProviderById = async (req, res) => {
  try {
    const provider = await Provider.findOne({ user: req.params.id }).populate('user', 'name email phone role');
    
    if (!provider) {
      return res.status(404).json({ success: false, message: 'Khabiirka lama helin' });
    }

    res.json({
      success: true,
      data: {
        _id: provider.user._id, 
        name: provider.fullName || provider.user.name,
        email: provider.user.email,
        phone: provider.user.phone,
        location: provider.location,
        serviceType: provider.serviceType,
        serviceId: provider.serviceId,
        status: provider.status,
        bio: provider.bio
      }
    });
  } catch (error) {
    console.error('🔥 Get Profile Error:', error.message);
    res.status(500).json({ success: false, message: 'Cillad: ' + error.message });
  }
};