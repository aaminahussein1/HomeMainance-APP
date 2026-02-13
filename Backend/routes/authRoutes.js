import express from 'express';
const router = express.Router();

import {
  createBooking,
  updateBookingStatus,
  completeBooking,
  getMyBookings,
} from '../controllers/controllerBooking.js'; 

import { protect } from '../middleware/auth.js'; 

router.post('/', protect, createBooking);
router.patch('/:id/status', protect, updateBookingStatus);
router.patch('/:id/complete', protect, completeBooking);
router.get('/my', protect, getMyBookings);

export default router;