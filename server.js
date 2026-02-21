import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// 1. Soo dhoofinta Routes-ka
import userRoutes from './routes/userRoutes.js';
import serviceRoutes from './routes/services.js';
import providerRoutes from './routes/providers.js';
import bookingRoutes from './routes/routeBooking.js'; 
import reviewRoutes from './routes/reviews.js'; 
import adminRoutes from './routes/adminRoutes.js'; 

// 2. Habaynta __dirname (ES Modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();

// --- TALLAABADA MUHIIMKA AH: CORS ---
// Hubi in URL-kan uu yahay kanaga Railway
const allowedOrigins = [
    'https://homemainance-app-production.up.railway.app',
    'http://localhost:5173', // Wixii tijaabo ah
    'http://localhost:3000'
];

app.use(cors({
    origin: function (origin, callback) {
        // Oggolow haddii origin-ku ku jiro liiska ama haddii uu yahay aalad (sida Postman)
        if (!origin || allowedOrigins.indexOf(origin) !== -1 || origin === 'null') {
            callback(null, true);
        } else {
            callback(new Error('CORS Policy: Origin not allowed'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());

// 3. Database Connection
const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
    console.error("❌ ERROR: MONGO_URI is missing in environment variables!");
}

mongoose.connect(mongoURI)
    .then(() => console.log("✅ MongoDB Connected!"))
    .catch((err) => console.error("❌ Database Error:", err.message));

// 4. API Routes
app.use('/api/auth', userRoutes);      
app.use('/api/users', userRoutes);      
app.use('/api/services', serviceRoutes);
app.use('/api/providers', providerRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes); 

// 5. Serving Frontend (Static Files)
// Hubi in faylka 'Frontend/dist' uu dhab ahaan u jiro meesha saxda ah
const frontendPath = path.join(__dirname, 'Frontend', 'dist');
app.use(express.static(frontendPath)); 

// 6. Root Route (Handling Frontend Routing)
// Midkani waa inuu ahaadaa kan ugu dambeeya ee Routes-ka
app.get('*', (req, res) => {
    // Haddii codsigu ku bilaabmo /api/, ha u dirin frontend-ka (Error 404 API)
    if (req.url.startsWith('/api/')) {
        return res.status(404).json({ message: "API route not found" });
    }
    
    const indexPath = path.join(frontendPath, 'index.html');
    res.sendFile(indexPath, (err) => {
        if (err) {
            res.status(500).send("Cillad: Ma la heli karo Frontend Build-ka. Hubi folder-ka Frontend/dist.");
        }
    });
});

// 7. Global Error Handler
app.use((err, req, res, next) => {
    console.error("🔥 Server Error Stack:", err.stack);
    res.status(err.status || 500).json({ 
        success: false, 
        message: err.message || "Cillad farsamo ayaa dhacday!",
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

const PORT = process.env.PORT || 5006;

// '0.0.0.0' waa lagama maarmaan si Railway uu u helo server-ka
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`🌍 Frontend path: ${frontendPath}`);
});