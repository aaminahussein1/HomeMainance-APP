import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api'; 
import toast from 'react-hot-toast';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // 1. Initial State ka soo qaado LocalStorage
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser && savedUser !== "undefined" ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  // 2. Hubi Login-ka mar kasta oo Page-ka la refresh gareeyo
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Backend-kaagu waa inuu leeyahay GET /api/users/profile
          const response = await api.get('/users/profile'); 
          if (response.data.success) {
            setUser(response.data.user);
            setIsAuthenticated(true);
          }
        } catch (error) {
          console.error("Auth check failed:", error);
          // Haddii token-ku dhacay ama server-ku diiday, logout garee
          logout(); 
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
      setIsLoading(false); // Muhiim: Halkan geli si loading-ka u damiyo mar kasta
    };
    
    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await api.post('/users/login', credentials);
      const { token, user: userData } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setUser(userData);
      setIsAuthenticated(true);
      toast.success('Si guul leh ayaad u soo gashay!');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Login-ku ma suurtagalin';
      toast.error(message);
      throw error;
    }
  };

  const updateUser = async (updatedData) => {
    try {
      // Hubi in Backend-kaagu leeyahay PUT /api/users/profile
      const response = await api.put('/users/profile', updatedData); 
      const newUserXog = response.data.user;
      
      setUser(newUserXog);
      localStorage.setItem('user', JSON.stringify(newUserXog));
      toast.success('Profile-ka waa la cusboonaysiiyey!');
      return newUserXog;
    } catch (error) {
      const message = error.response?.data?.message || 'Laguma guulaysan in la beddelo profile-ka';
      toast.error(message);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    // Waxaan ku daray condition si uusan u soo noqnoqon toast-ku haddii login la'aan la yahay
    if (isAuthenticated) toast.success('Si guul leh ayaad ka baxday!');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout, updateUser }}>
      {/* isLoading halkan waa muhiim si uusan App-ku u muujin bogga login-ka 
         isagoo weli xogta ka soo helaya Backend-ka.
      */}
      {!isLoading ? children : (
        <div className="flex items-center justify-center h-screen bg-[#020617]">
          <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};