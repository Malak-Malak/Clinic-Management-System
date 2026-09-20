import api from './api';

export const getAvailableSlots = (doctorId, date) =>
  api.get('/appointments/available-slots', { params: { doctorId, date } });

export const bookAppointment = (data) => api.post('/appointments', data);

export const getMyAppointments = () => api.get('/appointments/my');

export const cancelAppointment = (id) => api.delete(`/appointments/${id}`);
export const getDoctorAppointments = () => api.get('/appointments/doctor');

export const completeVisit = (id, notes) => api.post(`/appointments/${id}/complete`, { notes });