import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { 
  FiHome, FiShoppingBag, FiUsers, 
  FiLogOut, FiMenu, FiX, FiCheckSquare, FiLayout, FiUser
} from 'react-icons/fi'

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    setMobileMenuOpen(false)
    navigate('/')
  }

  const isActive = (path) => location.pathname === path

  const menuItems = [
    { icon: FiHome, label: 'Home', path: '/' },
  ]

  if (isAuthenticated && (user?.role === 'customer' || user?.role === 'admin')) {
    menuItems.push({ icon: FiShoppingBag, label: 'Services', path: '/services' })
  }

  if (isAuthenticated && user?.role === 'admin') {
    menuItems.push({ icon: FiUsers, label: 'Providers', path: '/providers' })
    menuItems.push({ icon: FiLayout, label: 'Dashboard', path: '/dashboard' })
    menuItems.push({ icon: FiCheckSquare, label: 'Admin Bookings', path: '/admin/bookings' })
  }

  if (isAuthenticated && user?.role === 'customer') {
    menuItems.push({ icon: FiCheckSquare, label: 'Bookings', path: '/my-bookings' })
  }

  return (
    /* 1. Waxaan ka saarnay 'max-w-7xl' waxaana ku darnay 'w-full' si uu u buuxiyo booska u banaan */
    <header className="bg-white/70 backdrop-blur-md sticky top-0 z-50 border-b border-sky-50 transition-all duration-300 w-full">
      {/* 2. 'mx-auto' ayaan ka saarnay qeybta sare, 'px-4' ayaan ku darnay si uusan geesaha ugu dhegin */}
      <div className="w-full px-4 md:px-8 py-3">
        <div className="flex justify-between items-center">
          
          {/* Logo - Hadda had iyo jeer wuxuu ka bilaaban doonaa bidixda booska u banaan */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <div className="bg-sky-500 text-white p-2 rounded-xl shadow-lg shadow-sky-200 group-hover:scale-110 transition-all duration-500">
              <FiHome size={20} />
            </div>
            <div className="flex flex-col">
               <span className="text-lg font-black tracking-tighter text-slate-900 leading-none">
                Home<span className="text-sky-500 italic">Maintenance</span>
              </span>
              <span className="text-[7px] font-black uppercase tracking-[0.3em] text-slate-400">Maintenance Pro</span>
            </div>
          </Link>

          {/* Desktop Navigation - 'mx-4' ayaa lagu daray si uusan ugu dhawaan logada */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-50/50 p-1 rounded-2xl border border-slate-100 mx-4">
            {menuItems.map((item) => (
              <Link 
                key={item.path} 
                to={item.path} 
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all duration-300 ${
                  isActive(item.path) 
                  ? 'bg-white text-sky-500 shadow-sm' 
                  : 'text-slate-400 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <item.icon size={13} className={isActive(item.path) ? 'text-sky-500' : ''} />
                <span className="hidden xl:inline">{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Auth & User Profile */}
          <div className="flex items-center gap-3 shrink-0">
            {!isAuthenticated ? (
              <Link to="/register" className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] hover:bg-sky-500 transition-all active:scale-95">
                Register
              </Link>
            ) : (
              <div className="flex items-center gap-3 pl-4 border-l border-slate-100">
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-[8px] font-black text-sky-500 uppercase tracking-widest leading-none mb-1">{user?.role}</span>
                  <span className="text-[11px] font-black text-slate-900 leading-none">{user?.name?.split(' ')[0]}</span>
                </div>
                <div className="w-9 h-9 rounded-xl bg-sky-50 flex items-center justify-center text-sky-500 border border-sky-100">
                  <FiUser size={18} />
                </div>
                <button 
                  onClick={handleLogout} 
                  className="p-2 rounded-lg bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all"
                  title="Logout"
                >
                  <FiLogOut size={16} />
                </button>
              </div>
            )}
            
            {/* Mobile Menu Toggle - Waxaa la tusayaa kaliya marka shaashadu yar tahay */}
            <button className="lg:hidden p-2 text-slate-900 bg-slate-50 rounded-xl border border-slate-100" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <FiX size={18} /> : <FiMenu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 space-y-2 animate-in fade-in slide-in-from-top-2">
            {menuItems.map((item) => (
              <Link 
                key={item.path} 
                to={item.path} 
                className={`flex items-center gap-3 p-4 rounded-xl font-black text-[10px] uppercase tracking-widest ${
                  isActive(item.path) ? 'bg-sky-500 text-white' : 'bg-slate-50 text-slate-500'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <item.icon size={16} />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  )
}

export default Header;