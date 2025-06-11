import { Role } from '../../../types/user';

interface RoleTableProps {
  roles: Role[];
  onEdit: (role: Role) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
  loading?: boolean;
}

const RoleTable = ({ roles, onEdit, onDelete, onAdd, loading }: RoleTableProps) => {
  return (
    <section className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-400">Roles</h3>
        <button
          onClick={onAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
        >
          Add Role
        </button>
      </div>

      <div className="w-full overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-900">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold">
            <tr>
              <th className="px-4 py-3 text-left">Role Name</th>
              <th className="px-4 py-3 text-left">Permissions</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {loading ? (
              <tr>
                <td colSpan={3} className="text-center py-6 text-gray-500 italic dark:text-gray-400">
                  Loading roles...
                </td>
              </tr>
            ) : roles.length > 0 ? (
              roles.map((role) => (
                <tr
                  key={role.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  <td className="px-4 py-3 text-gray-900 dark:text-white">
                    {role.name}
                  </td>
                  <td className="px-4 py-3">
                    <div className="space-y-2">
                      {Object.entries(role.permissions).map(([feature, perms]) => (
                        <div key={feature}>
                          <div className="font-medium text-gray-800 dark:text-gray-200 mb-1">{feature}</div>
                          <div className="flex flex-wrap gap-1">
                            {perms.map((perm) => (
                              <span
                                key={perm}
                                className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded dark:bg-blue-900 dark:text-blue-100"
                              >
                                {perm}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => onEdit(role)}
                        title="Edit"
                        className="px-2 py-1 text-xs font-medium bg-yellow-500 hover:bg-yellow-600 text-white rounded"
                      >
                        Edit
                      </button>
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
                    </div>
                  </td>
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
    </section>
  );
};

export default RoleTable;