import api from './api';

export const getSchedulesByDoctor = (doctorId) =>
  api.get(`/doctors/${doctorId}/schedules`);

export const createSchedule = (doctorId, data) =>
  api.post(`/doctors/${doctorId}/schedules`, data);

export const deleteSchedule = (doctorId, scheduleId) =>
  api.delete(`/doctors/${doctorId}/schedules/${scheduleId}`);