import React, { useState, useEffect } from 'react'; 
import { useSearchParams } from 'react-router-dom';
import api from '../../services/api'; 
import ProviderCard from './ProviderCard'; 
import { FiSearch, FiZap } from 'react-icons/fi';

const ProviderList = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();

  // 1. Soo qaado xogta URL-ka (Labadaba ID iyo Magaca)
  const serviceIdFromUrl = searchParams.get('serviceId');
  const serviceNameFromUrl = searchParams.get('serviceType');

  useEffect(() => {
    const loadProviders = async () => {
      try {
        setLoading(true);
        
        // 2. U dir Backend-ka params-ka si uu isagu soo shaandheeyo (Server-side search)
        // Tani waxay hubinaysaa in xogta rasmiga ah ay soo baxdo
        const res = await api.get('/users/providers', {
          params: {
            serviceId: serviceIdFromUrl,
            serviceType: serviceNameFromUrl
          }
        }); 
        
        if (res.data && res.data.success) {
          let allData = res.data.data || [];

          // 3. FILTERING LOGIC (Fallback haddii Backend-ku uusan wada filter-gareyn)
          if (serviceNameFromUrl || serviceIdFromUrl) {
            allData = allData.filter(provider => {
              // Xogta Provider-ka
              const pType = (provider.serviceType || "").toLowerCase().trim();
              const pId = String(provider.serviceId || "");
              
              // Xogta URL-ka
              const searchName = (serviceNameFromUrl || "").toLowerCase().trim();
              const searchId = String(serviceIdFromUrl || "");

              // XALKA: Hubi ID-ga marka hore, haddii kale Magaca
              return (
                (searchId && pId === searchId) || 
                (searchName && pType.includes(searchName)) || 
                (searchName && searchName.includes(pType))
              );
            });
          }

          setProviders(allData);
        }
      } catch (error) {
        console.error('API Error:', error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    loadProviders();
    // 4. Ku dar Labadaba dependency-ga si boggu u isbeddelo markaad category kale taabato
  }, [serviceNameFromUrl, serviceIdFromUrl]); 

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-sky-500 border-t-transparent shadow-md"></div>
      <p className="mt-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Raadinaya Khubaro...</p>
    </div>
  );

  return (
    <div className="container mx-auto px-6 pt-10 pb-20">
      {/* Header-ka Bogga */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
          {serviceNameFromUrl || 'Dhammaan Khubarada'} <span className="text-sky-500 italic">Directory</span>
        </h1>
        <div className="bg-white px-6 py-3 rounded-2xl shadow-xl shadow-sky-100/50 border border-sky-50 flex items-center gap-3">
          <div className="bg-sky-500 p-2 rounded-lg text-white">
            <FiZap size={16} />
          </div>
          <span className="font-black text-slate-700">{providers.length} Diyaar ah</span>
        </div>
      </div>

      {/* Liiska Khubarada */}
      {providers.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiSearch size={30} className="text-slate-200" />
          </div>
          <h3 className="text-xl font-bold text-slate-800">Ma jiro shaqaale loo helay</h3>
          <p className="text-slate-400 text-sm mt-2">
            Ma jiro khabiir hadda u diiwaangashan qaybta: <br/> 
            <span className="text-sky-500 font-bold">"{serviceNameFromUrl || 'Category-kan'}"</span>
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {providers.map((p) => (
            p && <ProviderCard key={p._id} provider={p} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProviderList;