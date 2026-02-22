import React, { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { FiCalendar, FiClock, FiMapPin, FiMessageSquare, FiSend, FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';

const BookingForm = () => {
  const { providerId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    date: '',
    time: '',
    address: '',
    description: ''
  });

  useEffect(() => {
    console.log("Current Logged User:", user);
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || (!user._id && !user.id)) {
      toast.error("Session expired. Please log in again.");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      };

      // Halkan waxaa laga saaray totalPrice
      const bookingData = {
        userId: user._id || user.id,
        service: providerId,
        date: formData.date,
        time: formData.time,
        address: formData.address,
        description: formData.description || "No description provided."
      };

      console.log("Sending to Server:", bookingData);

      const response = await axios.post('https://homemainance-app-production.up.railway.app/api/bookings', bookingData, config);

      if (response.data.success) {
        toast.success('Appointment booked successfully! ✨');
        navigate('/my-bookings'); // Waxaan u baddelay '/my-bookings' si uu u waafaqo Header-kaaga
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Server connection error';
      toast.error(errorMsg);
      console.error("Booking Error Details:", error.response?.data);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f9ff] py-16 px-6 relative overflow-hidden flex flex-col items-center">
      {/* Background Orbs */}
      <div className="absolute top-[-5%] left-[-5%] w-[35%] h-[35%] bg-sky-200/40 rounded-full blur-[100px] -z-10"></div>
      
      <div className="max-w-xl w-full">
        {/* Back Link */}
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-sky-600 font-black text-[10px] uppercase tracking-widest mb-8 hover:text-slate-900 transition-all group"
        >
          <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Providers
        </button>

        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-xl p-10 md:p-14 rounded-[3.5rem] shadow-[0_40px_100px_rgba(186,230,253,0.3)] border border-white relative">
          
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-sky-500 text-white rounded-[1.5rem] shadow-lg shadow-sky-100 mb-6 transform -rotate-3">
              <FiCalendar size={30} />
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-none">
              HOME <span className="text-sky-500 italic">Booking</span>
            </h2>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em] mt-3">Reserve your premium home service</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-5">
              {/* Date */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-sky-600 ml-2">
                  <FiCalendar size={12} /> Appointment Date
                </label>
                <input 
                  type="date" 
                  name="date" 
                  required 
                  onChange={handleChange} 
                  className="w-full bg-slate-50 border-none p-4 rounded-2xl focus:ring-4 focus:ring-sky-100 transition-all font-bold text-slate-700 outline-none" 
                />
              </div>
              
              {/* Time */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-sky-600 ml-2">
                  <FiClock size={12} /> Preferred Time
                </label>
                <input 
                  type="time" 
                  name="time" 
                  required 
                  onChange={handleChange} 
                  className="w-full bg-slate-50 border-none p-4 rounded-2xl focus:ring-4 focus:ring-sky-100 transition-all font-bold text-slate-700 outline-none" 
                />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-sky-600 ml-2">
                <FiMapPin size={12} /> Service Address
              </label>
              <input 
                type="text" 
                name="address" 
                placeholder="District, Street Name, House #" 
                required 
                onChange={handleChange} 
                className="w-full bg-slate-50 border-none p-5 rounded-2xl focus:ring-4 focus:ring-sky-100 transition-all font-semibold text-slate-700 outline-none placeholder:text-slate-300" 
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-sky-600 ml-2">
                <FiMessageSquare size={12} /> Job Details
              </label>
              <textarea 
                name="description" 
                placeholder="Describe the issue or service needed..." 
                onChange={handleChange} 
                className="w-full bg-slate-50 border-none p-5 rounded-2xl focus:ring-4 focus:ring-sky-100 transition-all h-32 outline-none resize-none font-medium text-slate-700 placeholder:text-slate-300" 
              />
            </div>

            {/* Summary Tag (PAYMENT SECTION REMOVED) */}

            <button 
              type="submit" 
              className="group relative w-full bg-sky-500 text-white py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.4em] overflow-hidden transition-all hover:bg-slate-900 hover:shadow-2xl hover:shadow-sky-200 active:scale-95 flex items-center justify-center gap-3 mt-4"
            >
              Confirm & Book <FiSend className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
          </form>

          {/* Verification Badge (PAYMENT REMOVED) */}
          <p className="text-center mt-8 text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">
            &bull; Professional Home Maintenance &bull;
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;