import express from 'express';
import jwt from 'jsonwebtoken';
import { User, Provider } from '../models/models.js';
import { protect } from '../middleware/auth.js'; 

const router = express.Router();

const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// --- 1. GET PROFILE (Saxidda 404 ee Console-ka) ---
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: "Isticmaalaha lama helin" });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// --- 2. UPDATE PROFILE (Saxidda 404 markii xogta la bedelayo) ---
router.put('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.phone = req.body.phone || user.phone;
      if (req.body.password) user.password = req.body.password;

      const updatedUser = await user.save();
      res.json({
        success: true,
        user: {
          id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          phone: updatedUser.phone
        }
      });
    } else {
      res.status(404).json({ success: false, message: "Isticmaalaha lama helin" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// --- 3. LOGIN ---
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: "Email ama Password khaldan" });
    }
    const token = generateToken(user);
    res.json({ success: true, token, user: { id: user._id, name: user.name, role: user.role } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// --- 4. REGISTER ---
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ success: false, message: "Email-kan waa la isticmaalay" });

    const user = await User.create({ name, email, password, phone, role: role || 'customer' });
    if (user.role === 'provider') {
      await Provider.create({ user: user._id, fullName: name, email, phone, status: 'pending' });
    }
    const token = generateToken(user);
    res.status(201).json({ success: true, token, user: { id: user._id, name: user.name, role: user.role } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;