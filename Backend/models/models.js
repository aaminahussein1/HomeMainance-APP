import mongoose from 'mongoose';


const bookingSchema = new mongoose.Schema({
  service: String,
  date: String,
  time: String,
  address: String,
  totalPrice: Number,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } 
}, { timestamps: true });

export const Booking = mongoose.model('Booking', bookingSchema);


const reviewSchema = new mongoose.Schema({
  user: { type: String, required: true }, 
  service: { type: String, required: true },
  serviceProvider: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true }
}, { timestamps: true });


export const Review = mongoose.model('Review', reviewSchema);