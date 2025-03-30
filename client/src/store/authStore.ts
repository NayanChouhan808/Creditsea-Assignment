import { create } from 'zustand';
import axios from 'axios';

type User = {
  id: string;
  email: string;
  role: 'ADMIN' | 'VERIFIER' | 'USER';
};

type AuthState = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  initialize: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set: any) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  
  initialize: async () => {
    set({ isLoading: true });
    const token = localStorage.getItem('token');
    
    if (token) {
      try {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        if (userData.id) {
          set({ 
            user: userData, 
            token, 
            isAuthenticated: true, 
            isLoading: false,
            error: null
          });
          return;
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
      }
    }
    
    set({ 
      user: null, 
      token: null, 
      isAuthenticated: false, 
      isLoading: false,
      error: null
    });
  },
  
  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      set({ 
        token, 
        user, 
        isAuthenticated: true, 
        isLoading: false,
        error: null
      });
    } catch (error: any) {
      console.error('Login error:', error);
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || 'Failed to login'
      });
      throw error;
    }
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    
    set({ 
      token: null, 
      user: null, 
      isAuthenticated: false,
      error: null
    });
  }
}));