// pullable request
import api from './axios';
import { Role } from '../types/user';

const endpoint = '/roles';

// 🔹 Get all roles for current tenant
export const getAllRoles = () => api.get(endpoint);
export const getRolesByTenant = (tenantId: string) => {
  return api.get(`/roles?tenantId=${tenantId}`);
};
export const getRoles = async (): Promise<Role[]> => {
    const res = await api.get('/roles');
    return res.data;
  };
// 🔹 Create a new role
export const createRole = (data: {
  name: string;
  description?: string;
  tenant_id: string;
  permissions?: Record<string, string[]>;
}) => api.post(endpoint, data);

// 🔹 Assign a role to a user (via /user-roles/assign)
export const assignRoleToUser = (user_id: string, role_id: string) =>
  api.post('/user-roles/assign', { userId: user_id, roleId: role_id });


export const getRolePermissions = async (): Promise<Record<string, string[]>> => {
  const response = await api.get('/roles/permissions');
  return response.data;
};

// 🔹 Get role assigned to a user
export const getUserRole = (user_id: string) =>
  api.get(`/user-roles/${user_id}`);

export const updateRole = (
  id: string,
  data: Partial<{
    name: string;
    permissions: Record<string, string[]>;
    description: string;
  }>
) => {
  return api.put(endpoint, { id, ...data });
};

  
export const deleteRole = (id: string) => api.delete(`${endpoint}?id=${id}`);