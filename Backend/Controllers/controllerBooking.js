import Booking from '../models/modelBooking.js';

// 1. Create a New Booking
export const createBooking = async (req, res) => {
  try {
    // Waxaan hubinaynaa in xogta req.body ay u gudubto si sax ah
    const newBooking = await Booking.create({
      ...req.body,
      // HUBI: Haddii Model-kaagu rabo 'user', u beddel customer -> user
      customer: req.user.id 
    });
    
    res.status(201).json({ success: true, data: newBooking });
  } catch (error) {
    // Haddii 'Booking.create' ay shaqayn weydo, isticmaal 'new Booking' iyo 'save()'
    res.status(400).json({ success: false, message: error.message });
  }
};

// 2. Update Booking Status
export const updateBookingStatus = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id, 
      { status: req.body.status }, 
      { new: true, runValidators: true } // runValidators waxay hubisaa in status-ka cusub uu sax yahay
    );
    
    if (!booking) return res.status(404).json({ success: false, message: "Ballanta lama helin" });
    
    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// 3. Complete Booking
export const completeBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id, 
      { status: 'completed' }, 
      { new: true }
    );
    
    if (!booking) return res.status(404).json({ success: false, message: "Ballanta lama helin" });
    
    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// 4. Get My Bookings
export const getMyBookings = async (req, res) => {
  try {
    // 'populate' waxay soo saaraysaa xogta adeegga (Service details) halkii ay ahaan lahayd ID kaliya
    const bookings = await Booking.find({ customer: req.user.id }).populate('service');
    
    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};