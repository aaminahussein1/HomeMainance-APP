import React from 'react';
import { Link } from 'react-router-dom';
import { FiClock, FiShield, FiStar, FiChevronRight, FiZap, FiTarget, FiCheckCircle } from 'react-icons/fi';
import ServiceList from '../components/services/ServiceList';

const Home = () => {
  return (
    <div className="bg-[#f8fafc] min-h-screen font-sans antialiased text-[#020617]">
      
      {/* --- ELITE HERO SECTION --- */}
      <section className="relative p-4 md:p-10"> 
        <div className="relative overflow-hidden bg-[#020617] rounded-[3.5rem] md:rounded-[5rem] min-h-[90vh] flex items-center shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)]">
          {/* Animated Background Gradients */}
          <div className="absolute top-0 right-0 w-full h-full opacity-30 bg-[radial-gradient(circle_at_top_right,_#0ea5e9,_transparent_50%)]"></div>
          <div className="absolute -bottom-24 -left-24 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[120px]"></div>

          <div className="container mx-auto px-8 md:px-20 relative z-10">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              <div className="space-y-10 py-20">
                <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-5 py-2 rounded-full backdrop-blur-md">
                  <span className="w-2 h-2 bg-sky-400 rounded-full animate-ping"></span>
                  <span className="text-sky-100 text-[10px] font-black tracking-[0.4em] uppercase">The Future of Care</span>
                </div>
                
                <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.95] tracking-tighter">
                  Expertise <br />
                  <span className="text-sky-500 italic">On Demand </span>
                </h1>
                
                <p className="text-slate-400 text-xl max-w-lg leading-relaxed font-medium">
                  Connect with the world's most disciplined home specialists. Every booking is a commitment to perfection.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center gap-6 pt-10">
  {/* Launch Catalog */}
  <Link 
    to="/services" 
    className="group relative min-w-[240px] px-10 py-6 bg-sky-500 text-[#020617] rounded-[2rem] font-black text-[11px] uppercase tracking-[0.3em] transition-all duration-500 hover:shadow-[0_20px_40px_rgba(14,165,233,0.4)] hover:-translate-y-1 active:scale-95 overflow-hidden"
  >
    {/* Shine Effect */}
    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
    
    <span className="relative z-10 flex items-center justify-center gap-2">
      More Services
      <FiChevronRight className="group-hover:translate-x-2 transition-transform duration-300" size={18} />
    </span>
  </Link>

  {/* Join Ecosystem */}
  <Link 
    to="/register" 
    className="min-w-[240px] px-10 py-6 bg-transparent border-2 border-white/10 text-white rounded-[2rem] font-black text-[11px] uppercase tracking-[0.3em] flex items-center justify-center transition-all duration-500 hover:bg-white hover:text-[#020617] hover:border-white hover:-translate-y-1 active:scale-95"
  >
    Join US
  </Link>

  {/* Ku dar CSS-kan haddii uusan horay ugu jirin faylkaaga CSS */}
  <style>{`
    @keyframes shimmer {
      100% { transform: translateX(100%); }
    }
  `}</style>
</div>
              </div>

              {/* Decorative Hero Visual */}
              <div className="hidden lg:block relative group">
                <div className="absolute -inset-10 bg-sky-500/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="bg-white/5 border border-white/10 p-6 rounded-[4rem] backdrop-blur-2xl -rotate-2 shadow-2xl transition-transform duration-700 group-hover:rotate-0">
                   <div className="bg-[#0f172a] rounded-[3rem] p-10 grid grid-cols-2 gap-6 border border-white/5">
                      <div className="aspect-square bg-sky-500/10 rounded-[2rem] border border-sky-500/20 flex items-center justify-center text-5xl hover:bg-sky-500/20 transition-colors">⚙️</div>
                      <div className="aspect-square bg-emerald-500/10 rounded-[2rem] border border-emerald-500/20 flex items-center justify-center text-5xl hover:bg-emerald-500/20 transition-colors">💎</div>
                      <div className="aspect-square bg-amber-500/10 rounded-[2rem] border border-amber-500/20 flex items-center justify-center text-5xl hover:bg-amber-500/20 transition-colors">⚡</div>
                      <div className="aspect-square bg-sky-500 rounded-[2rem] flex items-center justify-center text-5xl shadow-xl shadow-sky-500/20">🏡</div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- CORE PILLARS SECTION --- */}
      <section className="py-32 px-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-4 gap-12 items-center">
            <div className="lg:col-span-1 space-y-6">
              <div className="w-16 h-2 bg-sky-500 rounded-full"></div>
              <h2 className="text-3xl font-black tracking-tighter uppercase leading-none">Why <br/> Home Maintenance?</h2>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">Redefining service industry benchmarks through digital precision and vetted talent.</p>
            </div>
            
            <FeatureItem icon={FiShield} title="Verified Protocol" desc="Rigorous background checks for every specialist." />
            <FeatureItem icon={FiZap} title="Instant Sync" desc="Real-time scheduling with immediate confirmation." />
            <FeatureItem icon={FiTarget} title="Precision Quality" desc="Delivering 99.9% client satisfaction rating." />
          </div>
        </div>
      </section>

      {/* --- DYNAMIC SERVICE MARKETPLACE --- */}
      <section className="px-6 md:px-10 pb-20">
        <div className="bg-white rounded-[4rem] md:rounded-[6rem] py-24 px-10 md:px-20 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.03)] border border-sky-50 relative overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-10">
            <div className="max-w-xl space-y-4">
               <span className="text-sky-500 text-[10px] font-black uppercase tracking-[0.5em]">Curated Expertise</span>
               <h2 className="text-5xl font-black tracking-tighter text-slate-900">Featured <span className="text-slate-300 italic">Deployments.</span></h2>
               <p className="text-slate-500 font-medium text-lg">Select a specialized category to engage with our verified professionals.</p>
            </div>
            <Link to="/services" className="group px-8 py-4 bg-slate-50 text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 hover:bg-[#020617] hover:text-white transition-all duration-500">
              View Full Index <FiChevronRight className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
          
          <div className="relative z-10">
            <ServiceList limit={6} isHome={true} />
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-20 text-center space-y-6">
        <div className="flex items-center justify-center gap-2">
           <FiCheckCircle className="text-sky-500" size={16}/>
           <span className="text-[10px] font-black text-slate-900 uppercase tracking-[0.4em]">Authorized Premium Platform</span>
        </div>
        <p className="text-slate-400 text-[9px] uppercase tracking-[0.6em]">
          © 2026 Elite Home Ecosystem • Engineering Excellence
        </p>
      </footer>
    </div>
  );
};

const FeatureItem = ({ icon: Icon, title, desc }) => (
  <div className="bg-white p-10 rounded-[3rem] border border-sky-50 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.02)] hover:shadow-2xl hover:shadow-sky-100 transition-all duration-500 group relative overflow-hidden">
    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-sky-500 group-hover:rotate-[360deg] transition-all duration-700">
      <Icon className="text-sky-500 group-hover:text-white" size={28} />
    </div>
    <h3 className="text-xl font-black mb-2 tracking-tighter text-slate-900 uppercase">{title}</h3>
    <p className="text-slate-500 text-sm font-medium leading-relaxed">{desc}</p>
    <div className="absolute -bottom-2 -right-2 text-slate-50 opacity-0 group-hover:opacity-100 transition-opacity">
       <Icon size={80} />
    </div>
  </div>
);

export default Home;