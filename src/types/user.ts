export interface Role {
  id: string;
  name: string;
  permissions: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role_id: string;
  role?: Role;
  tenant_id?: string;
  is_active?: boolean;
}