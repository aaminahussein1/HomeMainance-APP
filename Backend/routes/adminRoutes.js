import express from 'express';
import { 
    getAdminStats, 
    getPendingProviders, 
    approveProvider, 
    rejectProvider 
} from '../Controllers/adminController.js';
import { getAdminDashboardStats } from '../Controllers/controllerBooking.js'; 
import { protect, admin } from '../Middleware/auth.js';

const router = express.Router();

// 1. Dashboard-ka Guud (Macaamiisha, Bookings, Revenue, Active Providers)
router.get('/stats', protect, admin, getAdminStats);

// 2. Dashboard-ka Labaad (Total Requests, Pending, Completed, Total Spent)
router.get('/dashboard-stats', protect, admin, getAdminDashboardStats);

// 3. Maamulka Khubarada (Providers Management)
router.get('/pending-providers', protect, admin, getPendingProviders);
router.put('/approve-provider/:id', protect, admin, approveProvider);
router.delete('/reject-provider/:id', protect, admin, rejectProvider);

export default router;