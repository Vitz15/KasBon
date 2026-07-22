import api from '@/lib/api';

export const reportService = {
  getSales: (startDate, endDate) => api.get('/reports/sales', { params: { start_date: startDate, end_date: endDate } }),
  getDebts: () => api.get('/reports/debts'),
  getStock: () => api.get('/reports/stock'),
  exportExcelUrl: (startDate, endDate) => `/api/v1/reports/export/excel?start_date=${startDate}&end_date=${endDate}`,
  exportPdfUrl: (startDate, endDate) => `/api/v1/reports/export/pdf?start_date=${startDate}&end_date=${endDate}`,
};