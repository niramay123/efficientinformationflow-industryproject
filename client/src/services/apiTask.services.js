import apiClient from '../apiClient';

// Supervisor APIs
export const createTaskAPI = (data) => apiClient.post('/task/create', data);
export const editTaskAPI = (id, data) => apiClient.put(`/task/${id}/update`, data);
export const deleteTaskAPI = (id) => apiClient.delete(`/task/${id}/delete`);
export const assignTaskAPI = (id, data) => apiClient.put(`/task/${id}/assign`, data);

// Operator APIs
export const updateStatusAPI = (id, payload) => apiClient.put(`/task/${id}/status`, payload);
export const getTasksAPI = () => apiClient.get('/task/:id/getMyTask'); // adjust :id if needed


// fetch all operators
export const getAllOperatorsAPI = () => apiClient.get("/user/operators");

export const updateOperatorAPI = (operatorId, data) => apiClient.put(`/user/operators/${operatorId}`, data);
