import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

axios.defaults.baseURL = API_URL;

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authApi = {
  login: (data: { email: string; password: string }) => 
    axios.post('/auth/login', data),
  register: (data: { email: string; password: string }) => 
    axios.post('/auth/register', data),
};

export const loanApi = {
  createLoan: (data: any) => 
    axios.post('/loans', data),
  getAllLoans: () => 
    axios.get('/loans'),
  getLoanById: (id: string) => 
    axios.get(`/loans/${id}`),
  verifyLoan: (id: string) => 
    axios.put(`/loans/${id}/verify`),
  rejectLoan: (id: string, rejectionReason: string) => 
    axios.put(`/loans/${id}/reject`, { rejectionReason }),
  approveLoan: (id: string) => 
    axios.put(`/loans/${id}/approve`),
  getLoanStatistics: () => 
    axios.get('/loans/statistics'),
  getTotalUsers: () =>
    axios.get('/user/total'),
  getUserLoanApplications: () =>
    axios.get('/loans/user'),
};

export const userApi = {
  getAllUsers: () => 
    axios.get('/user'),
  createAdmin: (data: { email: string; password: string }) => 
    axios.post('/user/admin', data),
  createVerifier: (data: { email: string; password: string }) => 
    axios.post('/user/verifier', data),
  deleteUser: (id: string) => 
    axios.delete(`/user/${id}`),
};