import React from 'react'
import { FiFacebook, FiTwitter, FiInstagram, FiPhone, FiMapPin, FiActivity, FiArrowUpRight,FiHome } from 'react-icons/fi'

const Footer = () => {
  return (
    /* Changed py-16 to py-8 for a smaller height */
    <footer className="bg-[#020617] text-slate-400 py-8 border-t border-white/5 relative overflow-hidden">
      {/* Subtle Glow Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-sky-500/50 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-8 md:px-12 relative z-10">
        
        {/* Changed gap-12 to gap-6 to bring elements closer */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
          
          {/* Brand Identity */}
          <div className="flex flex-col items-center lg:items-start gap-2">
            <div className="flex items-center space-x-3 group cursor-pointer">
              <div className="bg-sky-500 text-white p-1.5 rounded-xl shadow-xl shadow-sky-500/20 transform group-hover:rotate-12 transition-transform duration-500">
  <FiHome size={18} />
</div>
              <span className="text-xl font-black text-white tracking-tighter uppercase">
                HOME <span className="text-sky-500 italic">Maintenance</span>
              </span>
            </div>
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-500">Premium Home Solutions</p>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-10">
            <a href="/services" className="group flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.2em] text-white/70 hover:text-sky-400 transition-all">
              Our Services <FiArrowUpRight className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          </nav>

          {/* Contact & Social Intelligence */}
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex items-center gap-6 text-[9px] font-black uppercase tracking-widest text-slate-400 border-b lg:border-b-0 lg:border-r border-white/10 pb-2 lg:pb-0 lg:pr-6">
              <span className="flex items-center gap-2 hover:text-white transition-colors cursor-default">
                <FiMapPin className="text-sky-500" size={12}/> Hargeisa, SL
              </span>
              <span className="flex items-center gap-2 hover:text-white transition-colors cursor-default">
                <FiPhone className="text-sky-500" size={12}/> +252 63 4666778
              </span>
            </div>
            
            <div className="flex gap-3">
              {[FiFacebook, FiTwitter, FiInstagram].map((Icon, i) => (
                /* Changed w-10/h-10 to w-8/h-8 for smaller icons */
                <a 
                  key={i} 
                  href="#" 
                  className="w-8 h-8 flex items-center justify-center bg-white/5 text-white/50 rounded-xl hover:bg-sky-500 hover:text-white hover:-translate-y-1 transition-all duration-300 border border-white/5"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Global Copyright Bar - Reduced margin from mt-16 to mt-8 */}
        <div className="mt-8 pt-4 border-t border-white/[0.03] flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <p className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-500">Systems Operational &bull; Secure Protocol</p>
          </div>
          <p className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-600 italic">
            &copy; {new Date().getFullYear()} PROHUB GLOBAL &bull; All Rights Reserved
          </p>
        </div>

      </div>
    </footer>
  )
}

export default Footer;