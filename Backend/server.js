import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path'; // 1. Tan ku dar
import { fileURLToPath } from 'url'; // 2. Tan ku dar

// Soo dhoofinta Routes-ka
import userRoutes from './routes/userRoutes.js';
import serviceRoutes from './routes/services.js';
import providerRoutes from './routes/providers.js';
import bookingRoutes from './routes/routeBooking.js'; 
import reviewRoutes from './routes/reviews.js'; 
import adminRoutes from './routes/adminRoutes.js'; 

// 3. Habaynta __dirname (maadaama aad isticmaalayso ES Modules/Import)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// 4. U sheeg Express halka uu yaallo folder-ka Frontend-ka ee la dhisay (dist)
// Haddii backend-ka iyo frontend-ka isku folder ku dhex jiraan, u isticmaal sidaan:
app.use(express.static(path.join(__dirname, 'dist'))); 

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected!"))
    .catch((err) => console.error("❌ Database Error:", err));

// ISKU XIRKA ROUTES
app.use('/api/auth', userRoutes);      
app.use('/api/users', userRoutes);      
app.use('/api/services', serviceRoutes);
app.use('/api/providers', providerRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes); 

// 5. HALKAN WAA MEESHA MUHIIMKA AH:
// Wixii codsi ah oo aan ahayn API, u dir index.html-ka React si uusan "Cannot GET" u dhiibin
app.get('*', (req, res) => {
    // Haddii folder-ka 'dist' uu la yaallo server.js, koodhkani waa sax
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("🚨 Server Error:", err.stack);
    res.status(500).json({ 
        success: false, 
        message: "Cillad farsamo ayaa dhacday!",
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

const PORT = process.env.PORT || 5006;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});