import express from 'express';

import { Booking } from '../models/models.js'; 

const router = express.Router();


router.get('/my', async (req, res) => {
    try {
        const bookings = await Booking.find(); 
        res.status(200).json({ 
            success: true, 
            count: bookings.length,
            data: bookings 
        });
    } catch (error) {
        console.error("GET Error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
});

router.patch('/:id', async (req, res) => {
    try {
        const { id } = req.params; 
        const updates = req.body;  

        const updatedBooking = await Booking.findByIdAndUpdate(id, updates, {
            new: true,          
            runValidators: true  
        });

        if (!updatedBooking) {
            return res.status(404).json({ success: false, message: "Booking-kan lama helin!" });
        }

        res.status(200).json({ success: true, data: updatedBooking });
    } catch (error) {
        console.error("PATCH Error:", error.message);
        res.status(400).json({ success: false, message: error.message });
    }
});


router.post('/', async (req, res) => {
    try {
        const { service, date, time, address, totalPrice } = req.body;
        
        const newBooking = await Booking.create({
            service, 
            date,
            time,
            address,
            totalPrice: totalPrice || 0, 
            userId: req.user ? req.user.id : null 
        });

        res.status(201).json({ success: true, data: newBooking });
    } catch (error) {
        console.error("POST Error:", error.message);
        res.status(400).json({ success: false, message: error.message });
    }
});

export default router;