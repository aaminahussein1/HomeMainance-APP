const express = require('express');
const router = express.Router();

const {
  createBooking,
  updateBookingStatus,
  completeBooking,
  getMyBookings,
} = require('../controllers/bookings');

const auth = require('../middleware/auth');


router.post('/', auth, createBooking);


router.patch('/:id/status', auth, updateBookingStatus);


router.patch('/:id/complete', auth, completeBooking);


router.get('/my', auth, getMyBookings);

module.exports = router;
