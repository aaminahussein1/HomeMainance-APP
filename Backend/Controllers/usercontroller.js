import User from '../models/User.js';

// GET all users (admin)
export const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, search } = req.query;

    const query = {};
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .limit(Number(limit))
      .skip((page - 1) * Number(limit))
      .sort({ createdAt: -1 });

    const count = await User.countDocuments(query);

    res.json({
      users,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      totalUsers: count
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error while fetching users' });
  }
};

// GET user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (req.user.role !== 'admin' && req.user.id !== user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// CREATE user (admin only)
export const createUser = async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Not authorized' });

    const { name, email, password, role, phone, address } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const newUser = await User.create({
      name,
      email,
      password,
      role: role || 'customer',
      phone,
      address,
      isActive: true,
      isVerified: false
    });

    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      phone: newUser.phone,
      address: newUser.address,
      isActive: newUser.isActive,
      isVerified: newUser.isVerified
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// UPDATE user
export const updateUser = async (req, res) => {
  try {
    const { name, email, role, phone, address, isActive } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (req.user.role !== 'admin' && req.user.id !== user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (req.user.role === 'admin') {
      user.name = name || user.name;
      user.email = email || user.email;
      user.role = role || user.role;
      user.phone = phone || user.phone;
      user.address = address || user.address;
      user.isActive = isActive !== undefined ? isActive : user.isActive;
    } else {
      user.name = name || user.name;
      user.phone = phone || user.phone;
      user.address = address || user.address;
    }

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE user (admin only)
export const deleteUser = async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Not authorized' });

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.isActive = false;
    await user.save();

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET user stats
export const getUserStats = async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Not authorized' });

    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const customers = await User.countDocuments({ role: 'customer' });
    const providers = await User.countDocuments({ role: 'provider' });
    const admins = await User.countDocuments({ role: 'admin' });
    const verifiedUsers = await User.countDocuments({ isVerified: true });

    res.json({ totalUsers, activeUsers, customers, providers, admins, verifiedUsers });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
