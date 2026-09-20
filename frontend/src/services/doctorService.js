import api from './api';

export const getAllDoctors = () => api.get('/doctors');

export const getDoctorById = (id) => api.get(`/doctors/${id}`);

export const createDoctor = (data) => api.post('/doctors', data);

export const updateDoctor = (id, data) => api.put(`/doctors/${id}`, data);

export const deactivateDoctor = (id) => api.delete(`/doctors/${id}`);