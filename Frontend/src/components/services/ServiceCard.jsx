import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight, FiLock, FiSettings, FiHome } from 'react-icons/fi'; 
import { useAuth } from '../../context/AuthContext'; 
import toast from 'react-hot-toast';

const ServiceCard = ({ service }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handlePush = () => {
    if (isAuthenticated) {
      const type = encodeURIComponent(service.name);
      navigate(`/providers?serviceType=${type}&serviceId=${service._id}`);
    } else {
      toast.error("Authentication required to access specialists.");
      navigate('/register');
    }
  };

  return (
    /* h-full: Waxay hubisaa in dhammaan cards-ku ay hal dherer noqdaan */
    <div className="group relative bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_15px_40px_rgba(0,0,0,0.03)] overflow-hidden transition-all duration-500 hover:shadow-[0_30px_60px_rgba(14,165,233,0.1)] hover:-translate-y-2 flex flex-col h-full items-center text-center">
      
      {/* Decorative Accent Background */}
      <div className="absolute top-[-5%] right-[-5%] w-40 h-40 bg-sky-50 rounded-full -z-0 group-hover:bg-sky-100/50 transition-colors duration-500"></div>

      {/* flex-grow & justify-between: Waxay badhanka salka hoose ugu simayaan hal xariiq */}
      <div className="p-8 relative z-10 w-full flex flex-col items-center flex-grow justify-between">
        
        <div className="flex flex-col items-center w-full">
            {/* Category Icon - Wax yar waa la yareeyay */}
            <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center mb-6 shadow-lg transition-all duration-500 ${
              isAuthenticated 
              ? 'bg-sky-500 text-white shadow-sky-100 group-hover:rotate-12' 
              : 'bg-slate-100 text-slate-400'
            }`}>
              {isAuthenticated ? <FiHome size={28} /> : <FiSettings size={28} />}
            </div>

            {/* Qoraalka waa la yareeyay (text-2xl) waxaana la siiyay min-h si badhamadu u simnaadaan */}
            <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tighter leading-tight min-h-[70px] flex items-center justify-center px-2">
              {service.name}
            </h3>
            
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 mb-8">
              Professional Category
            </p>
        </div>
        
        {/* Explore Specialists Button - Pill Shape & Centered Text */}
        <button
          onClick={handlePush}
          className={`flex items-center justify-between w-full px-6 py-4 rounded-[1.8rem] font-black text-[10px] uppercase tracking-[0.2em] transition-all duration-500 group/btn shadow-xl ${
            isAuthenticated 
              ? "bg-[#0077b6] text-white hover:bg-[#023e8a] shadow-sky-100" 
              : "bg-slate-100 text-slate-400 border border-slate-200"
          }`}
        >
          <span className="relative z-10 block text-center flex-1">
            {isAuthenticated ? "Explore Specialists" : "Access Restricted"}
          </span>
          
          <div className={`ml-3 p-2 rounded-full transition-all duration-500 ${
            isAuthenticated ? 'bg-white/20' : 'bg-slate-200'
          }`}>
            {isAuthenticated ? (
              <FiArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
            ) : (
              <FiLock size={14} />
            )}
          </div>
        </button>
      </div>
    </div>
  );
};

export default ServiceCard;