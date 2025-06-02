import { useState } from 'react';
import { User, Role } from '../../../types/user';
import UserModal from './UserModal';

interface UserTableProps {
  users: User[];
  roles: Role[];
  onSave: (user: Omit<User, 'id'> | User) => void;
  onDelete: (id: string) => void;
}

const UserTable = ({ users, roles, onSave, onDelete }: UserTableProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleAdd = () => {
    setSelectedUser(null);
    setModalOpen(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    setSelectedUser(null);
  };

  return (
    <section className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-blue-700 dark:text-blue-400">Users</h2>
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Add User
        </button>
      </div>

      <div className="overflow-x-auto rounded border bg-white dark:bg-gray-900 dark:border-gray-700 shadow">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr className="text-gray-700 dark:text-gray-200">
              <th className="p-3 border-b">Name</th>
              <th className="p-3 border-b">Email</th>
              <th className="p-3 border-b">Role</th>
              <th className="p-3 border-b text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="text-center text-gray-500 dark:text-gray-400 py-6"
                >
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <td className="p-3 border-b text-gray-900 dark:text-gray-100">
                    {user.name}
                  </td>
                  <td className="p-3 border-b text-gray-700 dark:text-gray-300">
                    {user.email}
                  </td>
                  <td className="p-3 border-b text-gray-700 dark:text-gray-300">
                    {user.role?.name || '—'}
                  </td>
                  <td className="p-3 border-b text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="text-xs bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this user?')) {
                            onDelete(user.id);
                          }
                        }}
                        className="text-xs bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <UserModal
        isOpen={modalOpen}
        onClose={handleClose}
        onSave={onSave}
        userToEdit={selectedUser}
        roles={roles}
      />
    </section>
  );
};

export default UserTable;