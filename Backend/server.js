import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';


import userRoutes from './routes/userRoutes.js';
import bookingRoutes from './routes/routeBooking.js';
import serviceRoutes from './routes/services.js';
import reviewRoutes from './routes/reviews.js'; 

dotenv.config();
const app = express();


app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log(" MongoDB Connected!"))
    .catch((err) => console.log(" Database Error:", err));


app.use('/api/users', userRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/reviews', reviewRoutes); 

const PORT = process.env.PORT || 5006; 
app.listen(PORT, () => {
    console.log(` Server is running on http://localhost:${PORT}`);
});