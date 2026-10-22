import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

// Create Axios custom instance
export const api = axios.create({
  baseURL: '/api',
  withCredentials: true // send cookies
});

<<<<<<< HEAD
// Helper to decode JWT payload safely without external dependencies
const getJwtPayload = (jwtToken) => {
  try {
    if (!jwtToken || typeof jwtToken !== 'string') return null;
    const parts = jwtToken.split('.');
    if (parts.length !== 3) return null;
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

// Helper to calculate remaining time in milliseconds until JWT expires
const getTokenRemainingMs = (jwtToken) => {
  const payload = getJwtPayload(jwtToken);
  if (!payload || !payload.exp) return 0;
  const remaining = payload.exp * 1000 - Date.now();
  return remaining > 0 ? remaining : 0;
};

=======
>>>>>>> origin/main
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('accessToken') || null);
  const [loading, setLoading] = useState(true);

<<<<<<< HEAD
  // Helper to handle expired session (1-day limit)
  const handleSessionExpired = (message = 'Your session has expired. Please login again.') => {
    sessionStorage.setItem('authErrorMessage', message);
    setToken(null);
    setUser(null);
    localStorage.removeItem('accessToken');
    delete api.defaults.headers.common['Authorization'];
    const currentPath = window.location.pathname;
    if (currentPath !== '/login' && currentPath !== '/forgot-password' && currentPath !== '/reset-password') {
      window.location.href = '/login';
    }
  };

=======
>>>>>>> origin/main
  // Set auth header whenever token changes
  useEffect(() => {
    if (token) {
      localStorage.setItem('accessToken', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      localStorage.removeItem('accessToken');
      delete api.defaults.headers.common['Authorization'];
    }
  }, [token]);

<<<<<<< HEAD
  // Initial load: Fetch current user profile if token exists and is not expired
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('accessToken');
      if (storedToken) {
        const remainingMs = getTokenRemainingMs(storedToken);
        if (remainingMs <= 0) {
          handleSessionExpired('Your session has expired. Please login again.');
          setLoading(false);
          return;
        }

=======
  // Initial load: Fetch current user profile if token exists
  useEffect(() => {
    const initAuth = async () => {
      if (token) {
>>>>>>> origin/main
        try {
          const res = await api.get('/auth/me');
          if (res.data.success) {
            setUser(res.data.user);
          }
        } catch (error) {
          console.error('Error fetching initial profile:', error);
<<<<<<< HEAD
          if (error.response?.status === 401) {
            handleSessionExpired('Your session has expired. Please login again.');
=======
          // If token is invalid or expired, try to refresh first
          if (error.response && error.response.status === 401) {
            try {
              const refreshRes = await axios.post('/api/auth/refresh');
              if (refreshRes.data.success) {
                setToken(refreshRes.data.accessToken);
                const meRes = await axios.get('/api/auth/me', {
                  headers: { Authorization: `Bearer ${refreshRes.data.accessToken}` }
                });
                setUser(meRes.data.user);
              } else {
                logout();
              }
            } catch (err) {
              logout();
            }
>>>>>>> origin/main
          } else {
            logout();
          }
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

<<<<<<< HEAD
  // 1-Day (24-Hour) Session Timer & Active Visibility Check
  useEffect(() => {
    if (!token) return;

    const remainingMs = getTokenRemainingMs(token);
    if (remainingMs <= 0) {
      handleSessionExpired('Your session has expired. Please login again.');
      return;
    }

    // Auto-logout exactly when token / 1-day session expires
    const timer = setTimeout(() => {
      handleSessionExpired('Your session has expired. Please login again.');
    }, remainingMs);

    // Also check when tab becomes visible or receives focus
    const handleVisibilityOrFocus = () => {
      if (document.visibilityState === 'visible' || document.hasFocus()) {
        const checkRemaining = getTokenRemainingMs(token);
        if (checkRemaining <= 0) {
          handleSessionExpired('Your session has expired. Please login again.');
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityOrFocus);
    window.addEventListener('focus', handleVisibilityOrFocus);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('visibilitychange', handleVisibilityOrFocus);
      window.removeEventListener('focus', handleVisibilityOrFocus);
    };
  }, [token]);

  // Axios interceptor to handle expired tokens and 401 responses
  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          const url = error.config?.url || '';
          const code = error.response.data?.code;

          // Never log out on attendance endpoints, login attempts, face enrollment, or business logic failures
          if (
            url.includes('/attendance') ||
            url.includes('/auth/login') ||
            url.includes('/face-embeddings') ||
            code === 'BIOMETRIC_MISMATCH' ||
            code === 'GEOFENCE_FAILED'
          ) {
            return Promise.reject(error);
          }

          const msg = error.response.data?.message || 'Your session has expired. Please login again.';
          handleSessionExpired(msg);
=======
  // Axios interceptor to handle expired tokens and auto-refresh
  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        // Check if error is 401 (Unauthorized) and has code TOKEN_EXPIRED
        if (
          error.response && 
          error.response.status === 401 && 
          error.response.data.code === 'TOKEN_EXPIRED' && 
          !originalRequest._retry
        ) {
          originalRequest._retry = true;
          try {
            // Attempt to fetch new token using refresh endpoint
            const res = await axios.post('/api/auth/refresh');
            if (res.data.success) {
              const newAccessToken = res.data.accessToken;
              setToken(newAccessToken);
              
              // Update original request headers and retry
              originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
              return api(originalRequest);
            }
          } catch (refreshError) {
            console.error('Refresh token failed:', refreshError);
            logout();
            return Promise.reject(refreshError);
          }
>>>>>>> origin/main
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(interceptor);
    };
<<<<<<< HEAD
  }, []);
=======
  }, [token]);
>>>>>>> origin/main

  // Login handler
  const login = async (username, password) => {
    try {
<<<<<<< HEAD
      const cleanUsername = (username || '').trim();
      sessionStorage.removeItem('authErrorMessage');
      const res = await api.post('/auth/login', { username: cleanUsername, password });
=======
      const res = await api.post('/auth/login', { username, password });
>>>>>>> origin/main
      if (res.data.success) {
        setToken(res.data.accessToken);
        setUser(res.data.user);
        return { success: true, user: res.data.user };
      }
    } catch (error) {
<<<<<<< HEAD
      if (error.response?.data?.message) {
        return {
          success: false,
          message: error.response.data.message
        };
      }
      if (error.code === 'ERR_NETWORK' || !error.response || error.response?.status >= 500) {
        return {
          success: false,
          message: 'Unable to connect to backend server. Please verify backend is running on port 5000.'
        };
      }
      return {
        success: false,
        message: 'Login failed. Please check your credentials.'
=======
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed. Please check your credentials.'
>>>>>>> origin/main
      };
    }
  };

  // Logout handler
  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Logout error on server:', err);
    }
<<<<<<< HEAD
    sessionStorage.removeItem('authErrorMessage');
    setToken(null);
    setUser(null);
    localStorage.removeItem('accessToken');
    delete api.defaults.headers.common['Authorization'];
=======
    setToken(null);
    setUser(null);
    localStorage.removeItem('accessToken');
>>>>>>> origin/main
  };

  // Refresh user profile helper
  const refreshProfile = async () => {
    try {
      const res = await api.get('/auth/me');
      if (res.data.success) {
        setUser(res.data.user);
      }
    } catch (error) {
      console.error('Profile refresh failed', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
<<<<<<< HEAD

=======
>>>>>>> origin/main
