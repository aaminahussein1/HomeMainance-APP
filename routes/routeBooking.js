import express from 'express';
import { 
    getMyBookings, 
    createBooking, 
    getAllBookings,
    updateBookingStatus
    // SAXID: updatePaymentStatus waa laga saaray halkan waayo controller-ka kuma jiro
} from '../Controllers/controllerBooking.js'; 
import { protect, admin } from '../middleware/auth.js'; 

const router = express.Router();

// 1. Routes-ka Macmiilka (Customer)
router.post('/', protect, createBooking);
router.get('/my-bookings', protect, getMyBookings);

// 2. Route-ka Lacag Bixinta - WAA LAGA SAARAY
// Mar haddii nidaamku bilaash yahay, looma baahna router.put('/payment/:id'...)

// 3. Routes-ka Admin-ka
router.get('/all', protect, admin, getAllBookings); 
router.put('/status/:id', protect, admin, updateBookingStatus); 

export default router;