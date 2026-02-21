import express from 'express';
import jwt from 'jsonwebtoken';
import { User, Provider } from '../models/models.js';
import { protect } from '../middleware/auth.js'; 

const router = express.Router();

// 1. DIIWAANGELINTA (Register)
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, phone, role, serviceType, location, bio } = req.body;
        
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ success: false, message: "Email-kan hore ayaa loo isticmaalay" });

        const user = await User.create({ 
            name, email, password, phone, 
            role: role || 'customer' 
        });

        if (user.role === 'provider') {
            await Provider.create({
                user: user._id,
                fullName: name,
                email: email,
                phone: phone,
                serviceType: serviceType || 'General', 
                location: location || 'Not Specified',
                bio: bio || '',
                status: 'pending' 
            });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
        res.status(201).json({ success: true, token, user: { id: user._id, name: user.name, role: user.role } });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// 2. ADMIN-KA OO AQBALAYA CODSIGA
router.put('/approve-provider/:id', protect, async (req, res) => {
    try {
        const { status } = req.body; 

        // Waxaan raadineynaa Provider-ka
        let provider = await Provider.findById(req.params.id);
        if (!provider) {
            provider = await Provider.findOne({ user: req.params.id });
        }

        if (!provider) {
            return res.status(404).json({ success: false, message: "Khabiirka lama helin!" });
        }

        provider.status = status;
        await provider.save();

        res.status(200).json({ 
            success: true, 
            message: `Khabiirka ${provider.fullName} hadda waa ${status}`,
            data: provider 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// 3. HELITAANKA DHAMAAN KHUBARADA (Kaliya kuwa 'approved' ah)
router.get('/all-providers', async (req, res) => {
    try {
        const activeProviders = await Provider.find({ status: 'approved' })
            .populate('user', 'name phone email')
            .sort({ updatedAt: -1 });

        res.status(200).json({ success: true, data: activeProviders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// 4. HELITAANKA HAL KHABIIR (Profile Page - FIXED ID SEARCH)
router.get('/provider/:id', async (req, res) => {
    try {
        // Marka hore raadi adigoo isticmaalaya Provider ID
        let provider = await Provider.findById(req.params.id).populate('user', 'name phone email');
        
        // Haddii la waayo, raadi adigoo isticmaalaya User ID (waa muhiim haddii laga soo diray Profile-ka qofka)
        if (!provider) {
            provider = await Provider.findOne({ user: req.params.id }).populate('user', 'name phone email');
        }
        
        if (!provider) {
            return res.status(404).json({ success: false, message: "Khabiirka lama helin!" });
        }

        res.status(200).json({ success: true, data: provider });
    } catch (error) {
        // Haddii uu jiro khalad dhanka ID-ga ama xogta
        res.status(500).json({ success: false, message: "Profile-kan lama furi karo xilligan." });
    }
});

// 5. HELITAANKA CODSYADA SUGAN (Pending for Admin)
router.get('/pending-providers', protect, async (req, res) => {
    try {
        const pending = await Provider.find({ status: 'pending' }).populate('user', 'name phone email');
        res.status(200).json({ success: true, data: pending });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// 6. LOGIN
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ success: false, message: "Email ama Password khaldan" });
        }
        
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '30d' });
        res.json({ success: true, token, user: { id: user._id, name: user.name, role: user.role } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;