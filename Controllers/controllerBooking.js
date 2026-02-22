import Booking from '../models/Booking.js';

// 1. ADMIN ONLY: Aragtida dhammaan ballamaha
export const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('userId', 'name email phone') 
            .populate('service', 'fullName') 
            .sort({ createdAt: -1 });
            
        res.status(200).json({ success: true, data: bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. CUSTOMER ONLY: Macmiilku wuxuu arkaa kuwiisa kaliya
export const getMyBookings = async (req, res) => {
    try {
        // Hubi in 'req.user' uu jiro (waxaa soo gudbiya 'protect' middleware)
        const bookings = await Booking.find({ userId: req.user._id })
            .populate('service', 'fullName serviceType')
            .sort({ createdAt: -1 });
            
        res.status(200).json({ success: true, data: bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 3. ABUURISTA BALLAN (Macmiilka)
export const createBooking = async (req, res) => {
    try {
        const { service, date, time, address, description } = req.body;

        // Xaqiijin kooban (Validation)
        if (!service || !date || !time || !address) {
            return res.status(400).json({ success: false, message: "Fadlan buuxi meelaha muhiimka ah." });
        }

        const newBooking = await Booking.create({
            service,
            userId: req.user._id, 
            date,
            time,
            address,
            description: description || "No description provided",
            status: 'pending'
        });

        res.status(201).json({ success: true, data: newBooking });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 4. ADMIN ONLY: Wax ka beddelka Status-ka
export const updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; 
        
        const updatedBooking = await Booking.findByIdAndUpdate(
            id, 
            { status }, 
            { new: true }
        );
        
        if (!updatedBooking) {
            return res.status(404).json({ success: false, message: "Ballanta lama helin" });
        }

        res.status(200).json({ success: true, data: updatedBooking });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 5. DASHBOARD STATS
export const getAdminDashboardStats = async (req, res) => {
    try {
        const totalRequests = await Booking.countDocuments();
        const pendingActions = await Booking.countDocuments({ status: 'pending' });
        const completed = await Booking.countDocuments({ status: 'completed' });

        res.status(200).json({
            success: true,
            stats: {
                totalRequests,
                pendingActions,
                completed
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};