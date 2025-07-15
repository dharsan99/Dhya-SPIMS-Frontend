// pullable request
import { useMemo, useState } from 'react';
import { User, Role } from '../../../types/user';
import UserModal from './UserModal';
import Pagination from '@/components/Pagination';
import { usePaginationStore } from '@/store/usePaginationStore';
import useAuthStore from '@/hooks/auth';

interface UserTableProps {
  users: User[];
  roles: Role[];
  onSave: (user: Omit<User, 'id'> | User) => void;
  onDelete: (id: string) => void;
  onInvite?: () => void;
  loading?: boolean;
}

const UserTable = ({ users, roles, onSave, onDelete, onInvite, loading }: UserTableProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { page, setPage, rowsPerPage, setRowsPerPage } = usePaginationStore();

  console.log('users',users);

  const hasPermission = useAuthStore((state) => state.hasPermission);
    const canAdd = hasPermission('Users', 'Add User');
    const canEdit = hasPermission('Users', 'Update User');
    const canDelete = hasPermission('Users', 'Delete User');
    const showActions = canEdit || canDelete;

  const paginatedUsers = useMemo(()=>{
    const startIndex = (page - 1) * rowsPerPage;
    return users.slice(startIndex, startIndex + rowsPerPage);
  }, [users, page, rowsPerPage]);

  /*const handleAdd = () => {
    setSelectedUser(null);
    setModalOpen(true);
  };*/

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
        <div className="flex gap-2">
          {canAdd && onInvite && (
            <button
              onClick={onInvite}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
            >
              Invite User
            </button>
          )}
          
        </div>
      </div>

      <div className="w-full overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-900">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Role</th>
              {showActions && (
                <th className="px-4 py-3 text-center">Actions</th>
              )}

            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {/* Loading spinner row */}
            {loading ? (
              <tr>
                <td colSpan={showActions ? 4 : 3} className="text-center py-6 text-gray-800 italic dark:text-gray-400">
                  <div className="flex justify-center items-center h-24">
                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                </td>
              </tr>
            ) : users.length > 0 ? (
              paginatedUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  <td className="px-4 py-3 text-gray-900 dark:text-white">
                    {user.name}
                  </td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                    {user.email}
                  </td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                    {user.role?.name || <span className="italic text-gray-400">–</span>}
                  </td>
                  {showActions && (
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-2">
                      {canEdit && (
                        <button
                          onClick={() => handleEdit(user)}
                          title="Edit"
                          className="px-2 py-1 text-xs font-medium bg-yellow-500 hover:bg-yellow-600 text-white rounded"
                        >
                          Edit
                        </button>
                      )}
                      {canDelete && (
                        <button
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this user?')) {
                              onDelete(user.id);
                            }
                          }}
                          title="Delete"
                          className="px-2 py-1 text-xs font-medium bg-red-600 hover:bg-red-700 text-white rounded"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={showActions ? 4 : 3}
                  className="text-center py-6 text-gray-500 italic dark:text-gray-400"
                >
                  No users found.
                </td>
              </tr>
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
      <Pagination
          page={page}
          setPage={setPage}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          total={users.length}
        />
    </section>
  );
};

export default UserTable;