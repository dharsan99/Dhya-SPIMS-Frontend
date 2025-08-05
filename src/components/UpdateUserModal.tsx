import React, { useState, useEffect } from 'react';
import Select from 'react-select';

interface Role {
  id: string;
  name: string;
}

interface UpdateUserVars {
  name: string;
  roleId: string;
}

export default function UpdateUserModal({
  open,
  onClose,
  onSubmit,
  isLoading,
  roles,
  rolesLoading,
  initialName,
  initialRoleId,
}: {
  open: boolean,
  onClose: () => void,
  onSubmit: (vars: UpdateUserVars) => void,
  isLoading: boolean,
  roles: Role[],
  rolesLoading: boolean,
  initialName: string,
  initialRoleId: string,
}) {
  const [name, setName] = useState(initialName);
  const [roleId, setRoleId] = useState(initialRoleId);

  useEffect(() => {
    setName(initialName);
    setRoleId(initialRoleId);
  }, [initialName, initialRoleId, open]);

  const roleOptions = roles.map(r => ({ value: r.id, label: r.name }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, roleId });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl rounded-2xl border border-gray-100 dark:border-gray-700 p-8 relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-white transition"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white text-center">Update User</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter user name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
            <Select
              options={roleOptions}
              value={roleOptions.find(opt => opt.value === roleId) || null}
              onChange={opt => setRoleId(opt ? opt.value : '')}
              isLoading={rolesLoading}
              isDisabled={rolesLoading}
              placeholder="Select role"
              classNamePrefix="react-select"
              styles={{
                control: (base) => ({ ...base, backgroundColor: 'var(--tw-bg-opacity,1) #fff', borderColor: '#d1d5db', minHeight: 44 }),
                menu: (base) => ({ ...base, zIndex: 9999 }),
              }}
              required
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold transition shadow-md"
              disabled={isLoading}
            >
              {isLoading ? 'Updating...' : 'Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 