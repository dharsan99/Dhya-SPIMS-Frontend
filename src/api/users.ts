import api from './axios';

const endpoint = '/users';
export interface CreateUserPayload {
  tenant_id: string;
  name: string;
  email: string;
  password: string;
  role_id: string;
  is_active?: boolean;
}
export const createUser = async (data: CreateUserPayload): Promise<any> => {
  console.log('data',data);
  const response = await api.post('/users', data);
  console.log('response',response.data);
  return response.data;
};
// Get all users
export const getAllUsers = async (tenantId?: string) => {
  const params = tenantId ? { tenant_id: tenantId } : {};
  const res = await api.get(endpoint, { params });
  return res.data.data; // returns only the array
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
    role_id: string;
    is_active: boolean;
  }>
) => api.put(`${endpoint}/${id}`, data);

// Deactivate (soft delete) a user
export const deleteUser = (id: string) => api.delete(`${endpoint}/${id}`);