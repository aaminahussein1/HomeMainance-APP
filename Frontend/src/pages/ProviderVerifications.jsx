import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { FiCheckCircle, FiXCircle, FiMail, FiMapPin, FiAlertCircle, FiLoader, FiUserCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';

const ProviderVerifications = () => {
  const [pendingProviders, setPendingProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingProviders();
  }, []);

  const fetchPendingProviders = async () => {
    try {
      const response = await api.get('/providers');
      // Kaliya soo saar kuwa weli 'pending' ah
      const pending = response.data.filter(p => p.status === 'pending');
      setPendingProviders(pending);
    } catch (error) {
      console.error("Error fetching providers:", error);
      toast.error("Failed to load verification requests");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id, email) => {
    if (window.confirm(`Are you sure you want to approve ${email} as a verified provider?`)) {
      try {
        await api.patch(`/providers/${id}/status`, { status: 'approved' });
        toast.success(`Provider approved! Account is now active.`);
        fetchPendingProviders();
      } catch (error) {
        toast.error("Approval process failed.");
      }
    }
  };

  const handleReject = async (id) => {
    if (window.confirm("Are you sure you want to reject this application?")) {
      try {
        await api.patch(`/providers/${id}/status`, { status: 'rejected' });
        toast.error("Application rejected.");
        fetchPendingProviders();
      } catch (error) {
        toast.error("Update failed.");
      }
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8fafc]">
      <FiLoader className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
      <p className="text-slate-500 font-bold animate-pulse">Checking applications...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Provider <span className="text-indigo-600">Verification</span></h1>
            <p className="text-slate-500 mt-1 font-medium">Identity and professional skill review</p>
          </div>
          <div className="bg-white px-5 py-2 rounded-2xl border border-slate-200 shadow-sm self-start">
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">New Requests:</span>
            <span className="ml-2 text-indigo-600 font-black">{pendingProviders.length}</span>
          </div>
        </div>
        
        {pendingProviders.length === 0 ? (
          <div className="bg-white p-16 rounded-[3rem] text-center border-2 border-dashed border-slate-200 shadow-sm">
            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <FiUserCheck className="w-10 h-10 text-slate-300" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">No Pending Requests</h2>
            <p className="text-slate-500 mt-2 font-medium">All provider applications have been processed.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {pendingProviders.map((provider) => (
              <div 
                key={provider._id} 
                className="group bg-white p-6 md:p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500"
              >
                <div className="flex-1 space-y-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-2xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {provider.fullName}
                      </h3>
                      <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider">
                        {provider.serviceType}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-y-2 gap-x-6 text-slate-500 font-semibold text-sm">
                      <span className="flex items-center gap-2">
                        <FiMail className="text-slate-400" /> {provider.email}
                      </span>
                      <span className="flex items-center gap-2">
                        <FiMapPin className="text-slate-400" /> {provider.location}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-2 rounded-2xl text-xs font-bold w-fit">
                    <FiAlertCircle /> Identity review required
                  </div>
                </div>
                
                <div className="flex gap-3 w-full lg:w-auto border-t lg:border-t-0 pt-6 lg:pt-0">
                  <button 
                    onClick={() => handleApprove(provider._id, provider.email)}
                    className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black hover:bg-emerald-600 shadow-lg shadow-slate-200 hover:shadow-emerald-200 transition-all active:scale-95"
                  >
                    <FiCheckCircle size={18} /> Approve Account
                  </button>
                  <button 
                    onClick={() => handleReject(provider._id)}
                    className="flex items-center justify-center bg-rose-50 text-rose-600 px-6 py-4 rounded-2xl font-black hover:bg-rose-600 hover:text-white transition-all active:scale-95"
                  >
                    <FiXCircle size={18} /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProviderVerifications;