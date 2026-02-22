import React, { useState, useEffect } from 'react';
import api from '../services/api'; 
import { FiCalendar, FiMapPin, FiTool, FiCheckCircle, FiActivity, FiRotateCcw, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await api.get('/bookings/all'); 
      setBookings(res.data.data || []); 
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await api.put(`/bookings/status/${id}`, { status: newStatus });
      
      const messages = {
        completed: "Work marked as completed! 🌟",
        rejected: "Booking has been cancelled. ❌",
        active: "Booking has been reactivated."
      };
      
      toast.success(messages[newStatus] || "Update successful");
      fetchBookings(); 
    } catch (err) {
      toast.error("Update failed");
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Work <span className="text-blue-600">Orders</span>
          </h1>
          <p className="text-slate-500 font-medium mt-2 italic">
            Monitoring {bookings.length} active and past services.
          </p>
        </header>

        <div className="grid gap-6">
          {bookings.map((booking) => (
            <div key={booking._id} className={`bg-white p-8 rounded-[2rem] shadow-sm border flex flex-col md:flex-row justify-between items-start md:items-center gap-6 transition-all ${booking.status === 'rejected' ? 'opacity-75' : ''}`}>
              
              <div className="flex-1 w-full">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`p-3 rounded-2xl ${booking.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                    {booking.status === 'completed' ? <FiCheckCircle size={24} /> : <FiActivity size={24} className={booking.status !== 'rejected' ? "animate-pulse" : ""} />}
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900 uppercase">{booking.service?.fullName || "Service Requested"}</h3>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Customer: {booking.userId?.name || 'Customer'}</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-4 text-slate-500 text-sm font-bold mb-4">
                  <span className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                    <FiCalendar className="text-blue-500" /> {booking.date || 'Scheduled'}
                  </span>
                  <span className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                    <FiMapPin className="text-blue-500" /> {booking.address || 'Location'}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-center md:items-end gap-4 min-w-[220px] w-full md:w-auto">
                <div className="flex flex-col gap-2 w-full">
                  
                  {/* Kaliya muuji xaaladda haddii ay tahay mid kama dambays ah (Completed ama Rejected) */}
                  {booking.status === 'completed' && (
                    <span className="px-4 py-2 rounded-xl text-[10px] text-center font-black uppercase tracking-widest border bg-green-100 text-green-700 border-green-200 mb-2">
                      ✅ COMPLETED
                    </span>
                  )}
                  {booking.status === 'rejected' && (
                    <span className="px-4 py-2 rounded-xl text-[10px] text-center font-black uppercase tracking-widest border bg-red-100 text-red-700 border-red-200 mb-2">
                      ❌ CANCELLED
                    </span>
                  )}

                  {/* Toos u muuji badamada haddii shaqadu socoto (aan la dhamaystirin, lana tirtirin) */}
                  {booking.status !== 'completed' && booking.status !== 'rejected' && (
                    <div className="flex flex-col gap-2">
                      <button 
                        onClick={() => handleUpdateStatus(booking._id, 'completed')}
                        className="w-full py-3 px-6 rounded-xl font-black text-[10px] uppercase transition-all flex items-center justify-center gap-2 bg-green-600 text-white shadow-lg shadow-green-100 hover:bg-green-700 active:scale-95"
                      >
                         Mark as Completed
                      </button>
                      <button 
                        onClick={() => handleUpdateStatus(booking._id, 'rejected')} 
                        className="w-full bg-rose-50 text-rose-600 py-2 rounded-xl font-bold text-[10px] uppercase hover:bg-rose-600 hover:text-white transition-all flex items-center justify-center gap-1 active:scale-95"
                      >
                        <FiX size={14}/> Cancel Order
                      </button>
                    </div>
                  )}
                  
                  {booking.status === 'rejected' && (
                    <button onClick={() => handleUpdateStatus(booking._id, 'active')} className="w-full border-2 border-dashed border-blue-200 text-blue-600 py-2 rounded-xl text-[10px] font-bold uppercase hover:bg-blue-50 flex items-center justify-center gap-2 transition-all active:scale-95"><FiRotateCcw /> Reactivate Order</button>
                  )}

                  {booking.status === 'completed' && (
                    <p className="text-[9px] text-green-600 font-black text-center uppercase tracking-tighter">Job successfully closed</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookingsPage;