import mongoose from 'mongoose';
import User from '../models/User.js';
import Booking from '../models/Booking.js';

// 1. Dashboard Stats - Inuu xogta ka soo saaro meesha saxda ah
export const getAdminStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: 'customer' });
        const totalBookings = await Booking.countDocuments();
        
        // Active Providers: Waxaan ka soo xisaabinaynaa collection-ka 'providers' ee status-koodu yahay approved
        const activeProviders = await mongoose.connection.db.collection('providers').countDocuments({ status: 'approved' });
        
        // Pending Providers: Kuwa sugaya in la aqbalo
        const pendingCount = await mongoose.connection.db.collection('providers').countDocuments({ status: 'pending' });

        // Revenue-ka dhabta ah
        const revenueData = await Booking.aggregate([
            { 
                $match: { 
                    status: { $in: ['approved', 'completed'] } 
                } 
            },
            { 
                $group: { 
                    _id: null, 
                    total: { $sum: "$totalPrice" } 
                } 
            }
        ]);

        res.status(200).json({
            success: true,
            stats: {
                totalUsers,
                totalBookings,
                totalRevenue: revenueData[0]?.total || 0,
                activeProviders,
                pendingProviders: pendingCount
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. Helitaanka Codsiyada Pending-ka ah
export const getPendingProviders = async (req, res) => {
    try {
        const providers = await mongoose.connection.db.collection('providers')
            .find({ status: 'pending' })
            .toArray();
        res.status(200).json({ success: true, data: providers });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 3. Ansixinta Provider (Approve) - FINAL FIXED VERSION
export const approveProvider = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "ID-ga codsigu ma saxna" });
        }

        // 1. Hel xogta codsiga ka hor intaanan waxba beddelin
        const providerData = await mongoose.connection.db.collection('providers').findOne({ 
            _id: new mongoose.Types.ObjectId(id) 
        });

        if (!providerData) {
            return res.status(404).json({ success: false, message: "Codsiga lama helin" });
        }

        // 2. MUHIIM: Status-ka ka beddel 'pending' una beddel 'approved'
        // HA ISTICMAALIN deleteOne halkan!
        await mongoose.connection.db.collection('providers').updateOne(
            { _id: new mongoose.Types.ObjectId(id) },
            { $set: { status: 'approved' } }
        );

        // 3. U samee ama u cusboonaysii Account-kiisa collection-ka 'users'
        // Tani waxay u oggolaanaysaa inuu Login sameeyo isagoo leh role: provider
        await User.findOneAndUpdate(
            { email: providerData.email },
            { 
                $set: {
                    name: providerData.fullName || providerData.name,
                    email: providerData.email,
                    phone: providerData.phone,
                    role: 'provider',
                    status: 'approved',
                    isVerified: true
                },
                $setOnInsert: { password: "temporaryPassword123" } 
            },
            { upsert: true, new: true }
        );
        
        res.status(200).json({ 
            success: true, 
            message: "Xirfadlaha si guul leh ayaa loo ansixiyey, hadda wuxuu ka muuqanayaa liiska dhabta ah!" 
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 4. Diidmada Provider
export const rejectProvider = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "ID-ga ma saxna" });
        }
        
        await mongoose.connection.db.collection('providers').deleteOne({ _id: new mongoose.Types.ObjectId(id) });
        res.status(200).json({ success: true, message: "Codsigii waa la diiday waana la tirtiray" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};