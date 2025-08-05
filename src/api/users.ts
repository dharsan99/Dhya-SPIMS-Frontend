import api from './axios';

const endpoint = '/users';
export interface CreateUserPayload {
  tenantId: string;
  name: string;
  email: string;
  password: string;
  roleId: string;
  isActive?: boolean;
}
export const createUser = async (data: CreateUserPayload): Promise<any> => {
  console.log('data',data);
  const response = await api.post('/users', data);
  console.log('response',response.data);
  return response.data;
};
// Get all users
export const getAllUsers = async (tenantId?: string) => {
  const params = tenantId ? { tenantId: tenantId } : {};
  const res = await api.get(endpoint, { params });
  return res.data.users; // Changed from res.data.data to res.data.users
};

// Get a specific user by ID
export const getUserById = (id: string) => {
  return api.get(`${endpoint}/${id}`);
};

// ✅ Create a new user (role_id instead of role string)

// ✅ Update a user
export const updateUser = (
  id: string,
  data: Partial<{
    name: string;
    email: string;
    password: string;
    roleId: string;
    isActive: boolean;
  }>
) => api.put(`${endpoint}/${id}`, data);

// Deactivate (soft delete) a user
export const deleteUser = (id: string) => api.delete(`${endpoint}/${id}`);