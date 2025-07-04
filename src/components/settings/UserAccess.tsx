// pullable request
import { useState } from 'react';
import RoleTable from './useraccess/RoleTable';
import UserTable from './useraccess/UserTable';
import RoleModal from './useraccess/RoleModal';
import UserModal from './useraccess/UserModal';

import {
  createRole,
  deleteRole,
  getRolesByTenant,
  updateRole,
} from '../../api/roles';

import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getUserById,
} from '../../api/users';

import { Role, User } from '../../types/user';
import useAuthStore from '../../hooks/auth';
import { toast } from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';

const UserAccess = () => {
  const auth = useAuthStore();
  const tenantId = auth.user?.tenant_id || '';

  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  // ✅ Use useQuery to fetch roles
  const {
    data: roles = [],
    isLoading: rolesLoading,
    refetch: refetchRoles,
  } = useQuery({
    queryKey: ['roles', tenantId], // include tenantId for cache key
    queryFn: () => getRolesByTenant(tenantId),
    select: (res) => res.data,
    enabled: !!tenantId, // only run query if tenantId exists
  });

  // ✅ Use useQuery to fetch users
  const {
    data: users = [],
    refetch: refetchUsers,
  } = useQuery({
    queryKey: ['users'],
    queryFn: getAllUsers,
    select: (res) => res.data,
  });

  /*👇 Manual refetch when needed after save/delete
  const refetchAll = () => {
    refetchRoles();
    refetchUsers();
  };*/




  // ✅ Role Operations
  const handleSaveRole = async (data: { id?: string; name: string; permissions: Record<string, string[]> }) => {
    try {
      const description = `This is description of ${data.name}`;
      if (data.id) {
        await updateRole(data.id, {
          name: data.name,
          permissions: data.permissions,
          description: data.name,
        });
        toast.success('Role updated successfully');
  
        if (auth.user?.id) {
          const res = await getUserById(auth.user.id);
        
          auth.setAuth(auth.token!, res.data);
        }
  
      } else {
        await createRole({
          name: data.name,
          permissions: data.permissions,
          tenant_id: tenantId,
          description,
        });
        toast.success('Role created successfully');
      }
  
      setIsRoleModalOpen(false);
      setSelectedRole(null);
      refetchRoles();
  
    } catch (err) {
      console.error('Error saving role:', err);
      toast.error('Failed to save role');
    }
  };

  const handleDeleteRole = async (id: string) => {
    if (!confirm('Delete this role?')) return;
    try {
      await deleteRole(id);
      toast.success('Role deleted successfully');
      refetchRoles();
    } catch (err) {
      console.error('Error deleting role:', err);
      toast.error('Failed to delete role');
    }
  };

  // ✅ User Operations
  const handleSaveUser = async (user: Omit<User, 'id'> | User) => {
    try {
      if ('id' in user) {
        await updateUser(user.id, {
          name: user.name,
          email: user.email,
          is_active: user.is_active ?? true,
          role_id: user.role_id,
        });
        toast.success('User updated successfully');
      } else {
        await createUser({
          name: user.name,
          email: user.email,
          password: 'password123',
          tenant_id: tenantId,
          role_id: user.role_id,
          is_active: user.is_active ?? true,
        });
        toast.success('User created successfully');
      }

      setIsUserModalOpen(false);
      setSelectedUser(null);
      refetchUsers();
    } catch (err) {
      console.error('Error saving user:', err);
      toast.error('Failed to save user');
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Delete this user?')) return;
    try {
      await deleteUser(id);
      toast.success('User deleted successfully');
      refetchUsers();
    } catch (err) {
      console.error('Error deleting user:', err);
      toast.error('Failed to delete user');
    }
  };

  return (
    <div className="space-y-10 transition-colors duration-300">
      {/* 🔐 Role Management */}
      <section className="bg-white dark:bg-gray-900 p-6 rounded">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Role Management</h2>
        <RoleTable
          roles={roles}
          onEdit={(role) => {
            setSelectedRole(role);
            setIsRoleModalOpen(true);
          }}
          onDelete={handleDeleteRole}
          onAdd={() => {
            setSelectedRole(null);
            setIsRoleModalOpen(true);
          }}
          loading={rolesLoading}
        />
      </section>

      {/* 👤 User Management */}
      <section className="bg-white dark:bg-gray-900 p-6 rounded">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">User Management</h2>
        <UserTable
              users={users
                .filter((u: any) => u.is_active) // 👈 only active users
                .map((u: any) => ({
                  ...u,
                  role: roles.find((r: any) => r.id === u.role_id),
                }))}
              roles={roles}
              onSave={handleSaveUser}
              onDelete={handleDeleteUser}
            />
      </section>

      {/* 🔧 Role Modal */}
      <RoleModal
        isOpen={isRoleModalOpen}
        onClose={() => {
          setIsRoleModalOpen(false);
          setSelectedRole(null);
        }}
        onSave={handleSaveRole}
        roleToEdit={selectedRole}

      />

      {/* 🧑‍💻 User Modal */}
      <UserModal
        isOpen={isUserModalOpen}
        onClose={() => {
          setIsUserModalOpen(false);
          setSelectedUser(null);
        }}
        onSave={handleSaveUser}
        userToEdit={selectedUser}
        roles={roles}
      />
    </div>
  );
};

export default UserAccess;
