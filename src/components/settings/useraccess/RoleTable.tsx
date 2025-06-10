import { Role } from '../../../types/user';

interface RoleTableProps {
  roles: Role[];
  onEdit: (role: Role) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

const RoleTable = ({ roles, onEdit, onDelete, onAdd }: RoleTableProps) => {
  return (
    <section className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Roles</h3>
        <button
          onClick={onAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded transition"
        >
          Add Role
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded border bg-white dark:bg-gray-900 shadow-sm transition-colors">
        <table className="min-w-full text-sm text-left border-collapse">
          <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium">
            <tr>
              <th className="p-3 border-b">Role Name</th>
              <th className="p-3 border-b">Permissions</th>
              <th className="p-3 border-b text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {roles.length > 0 ? (
              roles.map((role) => (
                <tr
                  key={role.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  <td className="p-3 border-b font-medium text-gray-800 dark:text-white">
                    {role.name}
                  </td>
                  <td className="p-3 border-b text-gray-600 dark:text-gray-300">
                    {role.permissions?.length
                      ? role.permissions.join(', ')
                      : <span className="italic text-gray-400">—</span>}
                  </td>
                  <td className="p-3 border-b text-center">
                    <div className="inline-flex gap-2">
                      <button
                        onClick={() => onEdit(role)}
                        className="text-sm px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete role "${role.name}"?`)) {
                            onDelete(role.id);
                          }
                        }}
                        className="text-sm px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded transition"
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