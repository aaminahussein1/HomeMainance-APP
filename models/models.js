import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// 1. User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  role: { type: String, enum: ['customer', 'admin', 'provider'], default: 'customer' }
}, { timestamps: true });

// Password hashing
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// 2. Provider Schema
const providerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
  fullName: { type: String }, 
  email: { type: String },    
  serviceType: { type: String, default: 'General' },
  location: { type: String, default: 'Not Specified' },
  hourlyRate: { type: Number, default: 0 },       
  bio: { type: String, default: "" },             
  skills: [{ type: String }],                     
  experience: { type: Number, default: 0 },       
  certificates: [{ type: String }],               
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
}, { timestamps: true });

// 3. Booking Schema (PAYMENT-KA WAA LAGA SAARAY)
const bookingSchema = new mongoose.Schema({
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider', required: true }, 
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true },
  time: { type: String },
  address: { type: String, required: true },
  description: { type: String, default: "No description provided" },
  
  // Status-yada loo baahan yahay
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'completed', 'rejected', 'cancelled'], 
    default: 'pending' 
  }
  // Halkan waxaa laga saaray: totalPrice, transactionId, iyo paidAt
}, { timestamps: true });

// 4. Review Schema
const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  provider: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider' }, 
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true }
}, { timestamps: true });

// FINAL EXPORTS
export const User = mongoose.models.User || mongoose.model('User', userSchema);
export const Provider = mongoose.models.Provider || mongoose.model('Provider', providerSchema);
export const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);
export const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);