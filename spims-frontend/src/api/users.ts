import api from './axios';

const endpoint = '/users';

// Get all users
export const getAllUsers = () => api.get(endpoint);

// Get a specific user by ID
export const getUserById = (id: string) => api.get(`${endpoint}/${id}`);

// Create a new user
export const createUser = (data: {
  tenant_id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'supervisor' | 'operator';
  is_active?: boolean;
}) => api.post(endpoint, data);

// Update a user
export const updateUser = (
  id: string,
  data: Partial<{
    name: string;
    email: string;
    password: string;
    role: 'admin' | 'supervisor' | 'operator';
    is_active: boolean;
  }>
) => api.put(`${endpoint}/${id}`, data);

// Deactivate (soft delete) a user
export const deleteUser = (id: string) => api.delete(`${endpoint}/${id}`);