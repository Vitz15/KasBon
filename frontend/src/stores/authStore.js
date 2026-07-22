import { create } from 'zustand';
import api from '@/lib/api';

export const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  loading: false,
  error: null,

  initialize: () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      if (token && user) {
        set({ token, user: JSON.parse(user) });
      }
    }
  },

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      set({ token, user, loading: false });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Email atau password salah';
      set({ error: message, loading: false });
      return { success: false, message };
    }
  },

  register: async (name, email, password, password_confirmation, role = 'kasir') => {
    set({ loading: true, error: null });
    try {
      await api.post('/auth/register', { 
        name, 
        email, 
        password, 
        password_confirmation,
        role 
      });
      set({ loading: false });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registrasi gagal';
      set({ error: message, loading: false });
      return { success: false, message };
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      // Ignore token deletion error on backend
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      set({ user: null, token: null });
    }
  }
}));