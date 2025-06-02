// src/components/settings/UserAccess.tsx

import { useEffect, useState } from 'react';
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
} from '../../api/users';

import { Role, User } from '../../types/user';
import useAuthStore from '../../hooks/auth';
import { toast } from 'react-hot-toast'; // ✅ (Optional but better UX)

const UserAccess = () => {
  const auth = useAuthStore();
  const tenantId = auth.user?.tenant_id || '';

  const [roles, setRoles] = useState<Role[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      const [roleRes, userRes] = await Promise.all([
        getRolesByTenant(),
        getAllUsers(),
      ]);
      setRoles(roleRes.data);
      setUsers(userRes.data);
    } catch (err) {
      console.error('Error fetching user access data:', err);
      toast.error('Failed to fetch data');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ✅ Role Operations
  const handleSaveRole = async (data: { id?: string; name: string; permissions: string[] }) => {
    try {
      if (data.id) {
        await updateRole(data.id, { name: data.name, permissions: data.permissions });
        toast.success('Role updated successfully');
      } else {
        await createRole({ name: data.name, permissions: data.permissions, tenant_id: tenantId });
        toast.success('Role created successfully');
      }
      setIsRoleModalOpen(false);
      setSelectedRole(null);
      fetchData();
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
      fetchData();
    } catch (err) {
      console.error('Error deleting role:', err);
      toast.error('Failed to delete role');
    }
  };

  // ✅ User Operations
  const handleSaveUser = async (user: Omit<User, 'id'> | User) => {
    try {

      if ('id' in user) {
        // ✅ Update existing user
        await updateUser(user.id, {
          name: user.name,
          email: user.email,
          is_active: user.is_active ?? true,
          role_id: user.role_id, // 🔥 send role (string) here (not role_id)
        });
        toast.success('User updated successfully');
      } else {
        // ✅ Create new user
        await createUser({
          name: user.name,
          email: user.email,
          password: 'password123', // ✅ You can change this to random generator later
          tenant_id: tenantId,
          role_id: user.role_id,
          is_active: user.is_active ?? true,
        });
        toast.success('User created successfully');
      }

      setIsUserModalOpen(false);
      setSelectedUser(null);
      fetchData();
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
      fetchData();
    } catch (err) {
      console.error('Error deleting user:', err);
      toast.error('Failed to delete user');
    }
  };

  return (
    <div className="space-y-10 transition-colors duration-300">
      {/* 🔐 Role Management */}
      <section className="bg-white dark:bg-gray-900 p-6 rounded shadow">
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
        />
      </section>

      {/* 👤 User Management */}
      <section className="bg-white dark:bg-gray-900 p-6 rounded shadow">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">User Management</h2>
        <UserTable
          users={users.map((u) => ({
            ...u,
            role: roles.find((r) => r.id === u.role_id),
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