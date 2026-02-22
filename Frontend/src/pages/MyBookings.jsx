import React, { useState, useEffect } from 'react';
import api from '../services/api'; 
import { FiCalendar, FiMapPin, FiTool, FiCheckCircle, FiX, FiLoader, FiHome} from 'react-icons/fi';
import toast from 'react-hot-toast';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyBookings();
    const interval = setInterval(fetchMyBookings, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchMyBookings = async () => {
    try {
      const res = await api.get('/bookings/my-bookings');
      setBookings(res.data.data || []); 
    } catch (err) {
      console.error("Registry sync failed");
    } finally {
      setLoading(false);
    }
  };

  if (loading && bookings.length === 0) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
      <div className="flex flex-col items-center gap-4">
        <FiLoader className="animate-spin text-sky-500" size={48} />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Syncing Registry...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] py-16 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-sky-50 px-3 py-1 rounded-full mb-4">
              <span className="w-2 h-2 bg-sky-500 rounded-full animate-pulse"></span>
              <span className="text-[9px] font-black text-sky-600 uppercase tracking-widest">Active Portal</span>
            </div>
            <h1 className="text-4xl font-black text-[#020617] tracking-tighter uppercase">
              My Service <span className="text-sky-500 italic">History.</span>
            </h1>
          </div>
          <p className="text-slate-400 text-sm font-medium">Manage and track your premium deployments.</p>
        </div>
        
        {bookings.length === 0 ? (
          <div className="bg-white p-20 rounded-[3rem] text-center border-2 border-dashed border-slate-100 shadow-sm">
            <FiHome className="mx-auto text-slate-200 mb-6" size={64} />
            <h3 className="text-xl font-black text-slate-900 mb-2">No Active Deployments</h3>
            <p className="text-slate-400 font-medium max-w-xs mx-auto text-sm leading-relaxed">Your service registry is currently empty. Start your first booking to see it here.</p>
          </div>
        ) : (
          <div className="grid gap-8">
            {bookings.map((booking) => (
              <div key={booking._id} className="group bg-white p-2 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-slate-50 transition-all hover:shadow-xl hover:shadow-sky-100/40">
                <div className="p-6 md:p-8 flex flex-col lg:flex-row justify-between items-center gap-8">
                  
                  {/* Service Info */}
                  <div className="flex-1 w-full">
                    <div className="flex items-center gap-5 mb-6">
                      <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-inner transition-transform group-hover:rotate-6 ${booking.status === 'completed' ? 'bg-emerald-50 text-emerald-500' : 'bg-sky-50 text-sky-500'}`}>
                        {booking.status === 'completed' ? <FiCheckCircle size={32} /> : <FiTool size={32} />}
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-2 uppercase">
                          {typeof booking.service === 'object' ? booking.service?.fullName : 'Premier Maintenance'}
                        </h3>
                        <div className="flex items-center gap-2">
                           <span className="w-1.5 h-1.5 bg-slate-200 rounded-full"></span>
                           <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Deployment ID: {booking._id.slice(-8)}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 text-slate-500 text-[11px] font-black uppercase tracking-wider">
                      <span className="flex items-center gap-3 bg-slate-50 px-5 py-3 rounded-2xl border border-slate-100 group-hover:bg-sky-50 group-hover:border-sky-100 transition-colors">
                        <FiCalendar className="text-sky-500" size={16}/> {booking.date}
                      </span>
                      <span className="flex items-center gap-3 bg-slate-50 px-5 py-3 rounded-2xl border border-slate-100 group-hover:bg-sky-50 group-hover:border-sky-100 transition-colors">
                        <FiMapPin className="text-sky-500" size={16}/> {booking.address}
                      </span>
                    </div>
                  </div>

                  {/* Status Only (Payment Removed) */}
                  <div className="flex flex-col items-center lg:items-end gap-4 min-w-[220px] w-full lg:w-auto pt-6 lg:pt-0 border-t lg:border-t-0 lg:border-l border-slate-100 lg:pl-10">
                    <span className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.3em] border text-center w-full shadow-sm
                      ${booking.status === 'completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                        booking.status === 'approved' ? 'bg-sky-50 text-sky-600 border-sky-100' : 
                        booking.status === 'rejected' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                        'bg-amber-50 text-amber-600 border-amber-100 animate-pulse'}`}>
                      {booking.status === 'pending' ? 'Pending Approval' : booking.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;