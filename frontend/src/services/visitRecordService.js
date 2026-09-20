import api from './api';

export const getMyVisits = () => api.get('/visits/my');