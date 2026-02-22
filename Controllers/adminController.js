import mongoose from 'mongoose';
import User from '../models/User.js';
import Booking from '../models/Booking.js';
import Service from '../models/Service.js'; // 1. Soo dhowee Service Model-ka

// 1. Dashboard Stats - Waa sidii aad u qortay (Lama taaban)
export const getAdminStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: 'customer' });
        const totalBookings = await Booking.countDocuments();
        const activeProviders = await mongoose.connection.db.collection('providers').countDocuments({ status: 'approved' });
        const pendingCount = await mongoose.connection.db.collection('providers').countDocuments({ status: 'pending' });

        const revenueData = await Booking.aggregate([
            { $match: { status: { $in: ['approved', 'completed'] } } },
            { $group: { _id: null, total: { $sum: "$totalPrice" } } }
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

// 2. Helitaanka Codsiyada Pending-ka ah (Lama taaban)
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

// 3. Ansixinta Provider (Approve) - WAXAAN KU DARNAY SERVICE MAPPING
export const approveProvider = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "ID-ga codsigu ma saxna" });
        }

        const providerData = await mongoose.connection.db.collection('providers').findOne({ 
            _id: new mongoose.Types.ObjectId(id) 
        });

        if (!providerData) {
            return res.status(404).json({ success: false, message: "Codsiga lama helin" });
        }

        // --- QAYBTA CUSUB: HELITAANKA SERVICE ID SAX AH ---
        let finalServiceId = providerData.serviceId;

        // Haddii uusan haysan ID, magaca service-ka ku raadi DB-ga si uu u galo qaybtiisa
        if (!finalServiceId && providerData.serviceType) {
            const foundService = await Service.findOne({ 
                name: { $regex: new RegExp(`^${providerData.serviceType}$`, 'i') } 
            });
            if (foundService) {
                finalServiceId = foundService._id;
            }
        }

        // 2. Status-ka ka beddel 'pending' una beddel 'approved' + Update ServiceId
        await mongoose.connection.db.collection('providers').updateOne(
            { _id: new mongoose.Types.ObjectId(id) },
            { 
                $set: { 
                    status: 'approved',
                    serviceId: finalServiceId // Waxaan xaqiijinaynaa in ID-gu jiro
                } 
            }
        );

        // 3. U samee ama u cusboonaysii Account-kiisa collection-ka 'users'
        const updatedUser = await User.findOneAndUpdate(
            { email: providerData.email },
            { 
                $set: {
                    name: providerData.fullName || providerData.name,
                    email: providerData.email,
                    phone: providerData.phone,
                    role: 'provider',
                    serviceType: providerData.serviceType, // Inuu login-ka ku arko shaqadiisa
                    status: 'approved',
                    isVerified: true
                },
                $setOnInsert: { password: "temporaryPassword123" } 
            },
            { upsert: true, new: true }
        );

        // 4. Hubi in xogta Provider-ka ay ku xidhan tahay User ID-ga saxda ah
        await mongoose.connection.db.collection('providers').updateOne(
            { _id: new mongoose.Types.ObjectId(id) },
            { $set: { user: updatedUser._id } }
        );
        
        res.status(200).json({ 
            success: true, 
            message: `Xirfadlaha qaybta ${providerData.serviceType} si guul leh ayaa loo ansixiyey!` 
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 4. Diidmada Provider (Lama taaban)
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