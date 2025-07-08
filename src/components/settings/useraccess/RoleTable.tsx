// pullable request

import { useState } from 'react';
import { Role } from '../../../types/user';
import Pagination from '@/components/Pagination';
import useAuthStore from '@/hooks/auth';

interface RoleTableProps {
  roles: Role[];
  onEdit: (role: Role) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
  loading?: boolean;
}

const RoleTable = ({ roles, onEdit, onDelete, onAdd, loading }: RoleTableProps) => {
  const [expandedRoleId, setExpandedRoleId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const hasPermission = useAuthStore((state) => state.hasPermission);
  const canEdit = hasPermission('Roles', 'Update Role');
  const canDelete = hasPermission('Roles', 'Delete Role');
  const canAdd = hasPermission('Roles', 'Add Role');
  const showActions = canEdit || canDelete;

  

  const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedRoles = roles.slice(startIndex, endIndex);

  return (
    <section className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-400">Roles</h3>
        {canAdd && (
          <button
            onClick={onAdd}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
        >
          Add Role
        </button>
        )}
      </div>

      <div className="w-full overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-900">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold">
            <tr>
              <th className="px-4 py-3 text-left">Role Name</th>
              <th className="px-4 py-3 text-left">Permissions</th>
              {showActions && (
                <th className="px-4 py-3 text-center">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300 dark:divide-gray-800">
            {loading ? (
              <tr>
                <td colSpan={3} className="text-center py-6 text-gray-800 italic dark:text-gray-400">
                <div className="flex justify-center items-center h-24">
                  <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
                </td>
              </tr>
            ) : roles.length > 0 ? (
              paginatedRoles.map((role) => (
                <tr
                  key={role.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  <td className="px-4 py-3 text-gray-900 dark:text-white">
                    {role.name}
                  </td>
                  <td className="px-4 py-3">
  {(() => {
    const entries = Object.entries(role.permissions);
    const isExpanded = expandedRoleId === role.id;
    const visibleEntries = isExpanded ? entries : entries.slice(0, 2);

    return (
      <>
        <div className="space-y-2 grid grid-cols-1 md:grid-cols-2 gap-2">
          {visibleEntries.map(([feature, perms]) => (
            <div key={feature}>
              <div className="font-medium text-gray-800 dark:text-gray-200 mb-1">
                {feature}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                {perms.map((perm) => (
                  <span
                    className="block bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded dark:bg-blue-900 dark:text-blue-100 w-23 truncate"
                    title={perm}
                    key={perm}
                  >
                    {perm}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {entries.length > 2 && (
          <button
            className="text-blue-600 hover:underline text-xs mt-1"
            onClick={() =>
              setExpandedRoleId(isExpanded ? null : role.id)
            }
          >
            {isExpanded ? 'See less' : `+${entries.length - 2} more`}
          </button>
        )}
      </>
    );
  })()}
</td>
                  {showActions && (
                      <td className="px-4 py-3 text-center">
                        <div className="flex justify-center gap-2">
                          {canEdit && (
                            <button
                              onClick={() => onEdit(role)}
                              title="Edit"
                              className="px-2 py-1 text-xs font-medium bg-yellow-500 hover:bg-yellow-600 text-white rounded"
                            >
                              Edit
                            </button>
                          )}
                          {canDelete && (
                            <button
                              onClick={() => {
                                if (confirm(`Delete role "${role.name}"?`)) {
                                  onDelete(role.id);
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
                <td colSpan={3} className="text-center py-6 text-gray-500 italic dark:text-gray-400">
                  No roles found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Pagination
          page={page}
          setPage={setPage}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          total={roles.length}
        />
    </section>
  );
};

export default RoleTable;