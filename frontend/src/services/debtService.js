import api from '@/lib/api';

export const debtService = {
  getAll: (filters = {}) => api.get('/debts', { params: filters }),
  getById: (id) => api.get(`/debts/${id}`),
  pay: (id, data) => api.post(`/debts/${id}/pay`, data),
};