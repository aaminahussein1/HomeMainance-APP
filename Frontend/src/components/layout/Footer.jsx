import React from 'react'
import { FiFacebook, FiTwitter, FiInstagram, FiPhone, FiMapPin, FiArrowUpRight, FiHome } from 'react-icons/fi'

const Footer = () => {
  return (
    <footer className="bg-[#020617] text-slate-400 py-6 border-t border-white/5 w-full overflow-hidden">
      
      {/* Subtle Glow Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-sky-500/50 to-transparent"></div>
      
      <div className="w-full px-4 md:px-10 relative z-10">
        
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
          
          {/* Brand Identity */}
          <div className="flex flex-col items-center lg:items-start gap-1">
            <div className="flex items-center space-x-3 group cursor-default">
              <div className="bg-sky-500 text-white p-1.5 rounded-lg shadow-lg shadow-sky-500/20 transform group-hover:rotate-12 transition-transform duration-500">
                <FiHome size={16} />
              </div>
              <span className="text-lg font-black text-white tracking-tighter uppercase">
                HOME <span className="text-sky-500 italic">Maintenance</span>
              </span>
            </div>
            <p className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-500">Premium Home Solutions</p>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-6">
            <button className="group flex items-center gap-1 text-[9px] font-black uppercase tracking-[0.2em] text-white/70 hover:text-sky-400 transition-all cursor-pointer bg-transparent border-none">
              Our Services <FiArrowUpRight className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </nav>

          {/* Contact & Socials */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex items-center gap-4 text-[8px] font-black uppercase tracking-widest text-slate-400 lg:border-r border-white/10 lg:pr-4">
              <span className="flex items-center gap-1.5 hover:text-white transition-colors cursor-default">
                <FiMapPin className="text-sky-500" size={10}/> Hargeisa, SL
              </span>
              <span className="flex items-center gap-1.5 hover:text-white transition-colors cursor-default">
                <FiPhone className="text-sky-500" size={10}/> +252 63 4666778
              </span>
            </div>
            
            <div className="flex gap-2">
              {[FiFacebook, FiTwitter, FiInstagram].map((Icon, i) => (
                /* Waxaan u badalnay 'div' si uusan u refresh-gareyn bogga */
                <div 
                  key={i} 
                  className="w-7 h-7 flex items-center justify-center bg-white/5 text-white/50 rounded-lg hover:bg-sky-500 hover:text-white transition-all duration-300 border border-white/5 cursor-pointer shadow-sm"
                >
                  <Icon size={12} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Global Copyright Bar */}
        <div className="mt-6 pt-4 border-t border-white/[0.03] flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <p className="text-[7px] font-black uppercase tracking-[0.3em] text-slate-500">Systems Operational &bull; Secure Protocol</p>
          </div>
          <p className="text-[7px] font-black uppercase tracking-[0.3em] text-slate-600 italic">
            &copy; {new Date().getFullYear()} PROHUB GLOBAL
          </p>
        </div>

      </div>
    </footer>
  )
}

export default Footer;