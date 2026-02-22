import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    // Aqoonsiga adeegga (Provider-ka ama Service-ka)
    // Hubi in magaca model-ka adeeggaagu yahay 'Service' ama 'Provider'
    service: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Service', 
        required: true 
    },
    
    // Aqoonsiga qofka ballanta samaysanaya
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    
    date: { 
        type: String, 
        required: true 
    },
    
    time: { 
        type: String, 
        required: true 
    },
    
    address: { 
        type: String, 
        required: true 
    },
    
    description: { 
        type: String, 
        default: "Ma jirto sharaxaad la bixiyey." 
    },
    
    // --- PAYMENT-KA WAA LAGA SAARAY ---
    // Halkan looma baahna 'totalPrice' mar haddii nidaamku yahay bilaash.

    status: { 
        type: String, 
        enum: ['pending', 'confirmed', 'completed', 'cancelled'], 
        default: 'pending' 
    }
}, { timestamps: true });

// Tani waxay ka hortagtaa in model-ka la dhisayo dhowr jeer (Prevents OverwriteModelError)
const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);

export default Booking;