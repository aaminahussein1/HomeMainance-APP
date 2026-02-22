import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiShoppingBag, FiCalendar, FiDollarSign, FiStar, FiArrowRight, FiActivity, FiLayers,FiHome } from 'react-icons/fi';
import { bookingService } from '../services/bookingService';
import api from '../services/api'; 
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    totalSpent: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadStats();
    }
  }, [user]);

  const loadStats = async () => {
    try {
      setLoading(true);
      if (user?.role === 'admin') {
        const res = await api.get('/admin/dashboard-stats');
        if (res.data.success) {
          const s = res.data.stats;
          setStats({
            totalBookings: s.totalRequests || 0,
            pendingBookings: s.pendingActions || 0,
            completedBookings: s.completed || 0,
            totalSpent: s.totalSpent || 0,
          });
        }
      } else {
        const data = await bookingService.getMyBookings();
        const bookingsList = Array.isArray(data) ? data : (data.data || []);
        
        const total = bookingsList.length;
        const pending = bookingsList.filter(b => b.status === 'pending').length;
        const completed = bookingsList.filter(b => b.status === 'completed').length;
        const spent = bookingsList.reduce((sum, b) => sum + (b.totalPrice || 0), 0);

        setStats({
          totalBookings: total,
          pendingBookings: pending,
          completedBookings: completed,
          totalSpent: spent,
        });
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-bold animate-pulse">Loading dashboard...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f1f5f9] py-8 px-4 sm:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-2">
              Dashboard
            </h1>
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-medium">Welcome back,</span>
              <span className="text-indigo-600 font-bold text-lg">{user?.name}</span>
              {user?.role === 'admin' && (
                <span className="ml-2 text-[10px] bg-indigo-600 text-white font-black px-3 py-1 rounded-full shadow-lg shadow-indigo-200">
                  ADMINISTRATOR
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white px-6 py-4 rounded-3xl shadow-sm border border-slate-200/50">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 shadow-inner">
              <FiHome size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">System Status</p>
              <p className="text-sm font-bold text-slate-800">Account Verified</p>
            </div>
          </div>
        </div>

        {/* Stats Cards Grid - 2 cards for Customer, 4 for Admin */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 ${user?.role === 'admin' ? 'lg:grid-cols-4' : 'lg:grid-cols-2'} gap-8 mb-16`}>
          <StatCard
            icon={FiLayers}
            title="Total Requests"
            value={stats.totalBookings}
            subtitle="Overall activity"
            gradient="from-slate-800 to-slate-900 text-white"
          />

          {user?.role === 'admin' && (
            <StatCard
              icon={FiCalendar}
              title="Pending Actions"
              value={stats.pendingBookings}
              subtitle="Requires attention"
              gradient="from-white to-white text-indigo-600 border border-slate-200"
            />
          )}

          <StatCard
            icon={FiStar}
            title="Completed"
            value={stats.completedBookings}
            subtitle="Successfully closed"
            gradient="from-white to-white text-emerald-500 border border-slate-200"
          />

          {user?.role === 'admin' && (
            <StatCard
              icon={FiDollarSign}
              title="Total Revenue"
              value={`$${stats.totalSpent.toLocaleString()}`}
              subtitle="Gross income"
              gradient="from-indigo-600 to-violet-700 text-white"
            />
          )}
        </div>

        {/* Quick Actions Section */}
        <div className="relative overflow-hidden bg-white rounded-[3rem] shadow-2xl shadow-slate-200/60 border border-white p-8 md:p-12">
          <div className="relative z-10 mb-10">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Quick Actions</h2>
            <p className="text-slate-400 font-medium">Direct access to services</p>
          </div>
          
          {/* Layout adaptive: Admin sees 3, Customer sees 2 */}
          <div className={`grid grid-cols-1 ${user?.role === 'admin' ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-8 relative z-10`}>
            <QuickAction
              icon={FiShoppingBag}
              title={user?.role === 'admin' ? "System Bookings" : "New Request"}
              description={user?.role === 'admin' ? "Manage all client bookings" : "Browse and book our services"}
              link={user?.role === 'admin' ? "/admin/bookings" : "/services"}
              variant="indigo"
            />

            {/* KALIYA ADMIN ayaa arki kara Activity Log qaybta Quick Actions */}
            {user?.role === 'admin' && (
              <QuickAction
                icon={FiCalendar}
                title="Activity Log"
                description="Monitor and track all system history"
                link="/admin/bookings"
                variant="dark"
              />
            )}

            <QuickAction
              icon={FiUser}
              title="Account Settings"
              description="Manage your profile and preferences"
              link="/profile"
              variant="white"
            />
          </div>

          <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-50"></div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, title, value, subtitle, gradient }) => (
  <div className={`bg-gradient-to-br ${gradient} rounded-[2.5rem] p-8 shadow-xl hover:shadow-2xl transition-all duration-500 group cursor-default`}>
    <div className="flex justify-between items-start mb-8">
      <div className={`p-4 rounded-2xl transition-transform group-hover:scale-110 duration-500 ${gradient.includes('text-white') ? 'bg-white/10' : 'bg-slate-50 shadow-inner'}`}>
        <Icon size={26} />
      </div>
    </div>
    <h3 className={`text-[11px] font-black uppercase tracking-[0.2em] mb-2 ${gradient.includes('text-white') ? 'text-white/70' : 'text-slate-400'}`}>
      {title}
    </h3>
    <p className="text-4xl font-black tracking-tighter">{value}</p>
    <p className={`text-[10px] mt-4 font-bold ${gradient.includes('text-white') ? 'text-white/40' : 'text-slate-300'}`}>
      {subtitle}
    </p>
  </div>
);

const QuickAction = ({ icon: Icon, title, description, link, variant }) => {
  const styles = {
    indigo: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200",
    dark: "bg-slate-900 text-white hover:bg-black shadow-slate-300",
    white: "bg-white text-slate-900 border border-slate-200 hover:border-indigo-600 shadow-slate-100"
  };

  return (
    <Link to={link} className={`group p-8 rounded-[2.5rem] transition-all duration-500 shadow-lg flex flex-col h-full ${styles[variant]}`}>
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 ${variant === 'white' ? 'bg-slate-100 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white' : 'bg-white/10 text-white'}`}>
        <Icon size={28} />
      </div>
      <div className="mt-auto">
        <h3 className="font-black text-xl mb-2 tracking-tight group-hover:translate-x-1 transition-transform duration-300">{title}</h3>
        <p className={`text-sm mb-6 ${variant === 'white' ? 'text-slate-500' : 'text-white/60'}`}>{description}</p>
        <div className={`flex items-center gap-2 font-black text-[10px] uppercase tracking-widest ${variant === 'white' ? 'text-indigo-600' : 'text-white'}`}>
          Explore Now <FiArrowRight className="group-hover:translate-x-2 transition-transform duration-300" />
        </div>
      </div>
    </Link>
  );
};

export default Dashboard;