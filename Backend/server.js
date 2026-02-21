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

// Middleware
app.use(cors());
app.use(express.json());

// 3. Database Connection (Hubi in MONGO_URI uu ku jiro Railway Variables)
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log(" MongoDB Connected!"))
    .catch((err) => console.error(" Database Error:", err.message));

// 4. API Routes
app.use('/api/auth', userRoutes);      
app.use('/api/users', userRoutes);      
app.use('/api/services', serviceRoutes);
app.use('/api/providers', providerRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes); 

// 5. Serving Frontend (Static Files)
// Waxay u degeysaa folder-ka 'dist' ee React build-ka
app.use(express.static(path.join(__dirname, 'dist'))); 

// 6. Root Route (Handling Frontend Routing)
// Wixii aan API ahayn u dir index.html-ka React
app.get('*', (req, res) => {
    const indexPath = path.join(__dirname, 'dist', 'index.html');
    res.sendFile(indexPath, (err) => {
        if (err) {
            res.status(500).send("Fadlan iska hubi in folder-ka 'dist' uu jiro (npm run build).");
        }
    });
});

// 7. Global Error Handler
app.use((err, req, res, next) => {
    console.error(" Server Error:", err.stack);
    res.status(500).json({ 
        success: false, 
        message: "Cillad farsamo ayaa dhacday!",
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

const PORT = process.env.PORT || 5006;

app.listen(PORT, '0.0.0.0', () => {
    console.log(` Server is running on port ${PORT}`);
});
