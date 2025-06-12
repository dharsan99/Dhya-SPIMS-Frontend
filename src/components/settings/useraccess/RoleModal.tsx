import { useEffect, useState } from 'react';
import Modal from '../../Modal';

interface RoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { id?: string; name: string; permissions: Record<string, string[]> }) => void;
  roleToEdit?: { id: string; name: string; permissions: Record<string, string[]> } | null;
}

const FEATURES = [
  {
    name: 'Orders',
    subPermissions: ['Add Order', 'Update Order', 'Delete Order', 'View Order'],
  },
  {
    name: 'Shades',
    subPermissions: ['Add Shade', 'Update Shade', 'Delete Shade', 'View Shade'],
  },
  {
    name: 'Fibres',
    subPermissions: ['Add Fibre', 'Update Fibre', 'Delete Fibre'],
  },
  {
    name: 'Production',
    subPermissions: ['Add Production', 'Update Production', 'Delete Production'],
  },
  {
    name: 'Buyers',
    subPermissions: ['Add Buyer', 'Update Buyer', 'Delete Buyer'],
  },
  {
    name: 'Suppliers',
    subPermissions: ['Add Supplier', 'Update Supplier', 'Delete Supplier'],
  },
  {
    name: 'Settings',
    subPermissions: ['Access Settings'],
  },
];

const RoleModal = ({ isOpen, onClose, onSave, roleToEdit }: RoleModalProps) => {
  const [name, setName] = useState('');
  const [permissions, setPermissions] = useState<Record<string, string[]>>({});
  const [expandedFeatures, setExpandedFeatures] = useState<Record<string, boolean>>({});

  useEffect(() => {
  if (roleToEdit) {
    setName(roleToEdit.name);
    const grouped: Record<string, string[]> = {};
    const expanded: Record<string, boolean> = {};

    FEATURES.forEach(({ name, subPermissions }) => {
      const selected = roleToEdit.permissions[name] || [];
      const matched = subPermissions.filter(p => selected.includes(p));
      if (matched.length > 0) {
        grouped[name] = matched;
        expanded[name] = true; // Auto-expand if there are selected permissions
      }
    });

    setPermissions(grouped);
    setExpandedFeatures(expanded);
  } else {
    setName('');
    setPermissions({});
    setExpandedFeatures({});
  }
}, [roleToEdit, isOpen]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) return;

    onSave({ id: roleToEdit?.id, name: trimmedName, permissions });
    onClose();
  };

  const toggleParent = (feature: string, subPermissions: string[]) => {
    const allChecked = subPermissions.every(p => permissions[feature]?.includes(p));
    setPermissions(prev => ({
      ...prev,
      [feature]: allChecked ? [] : subPermissions,
    }));
    setExpandedFeatures(prev => ({
      ...prev,
      [feature]: !allChecked || prev[feature],
    }));
  };

  const toggleChild = (feature: string, permission: string) => {
    setPermissions(prev => {
      const current = prev[feature] || [];
      const updated = current.includes(permission)
        ? current.filter(p => p !== permission)
        : [...current, permission];
      return { ...prev, [feature]: updated };
    });
  };

  const isChecked = (feature: string, subPermissions: string[]) => {
    return subPermissions.every(p => permissions[feature]?.includes(p));
  };

  const isIndeterminate = (feature: string, subPermissions: string[]) => {
    const selected = permissions[feature] || [];
    return subPermissions.some(p => selected.includes(p)) && !isChecked(feature, subPermissions);
  };

  if (!isOpen) return null;

  return (
    <Modal onClose={onClose}>
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-900 rounded p-6 w-full max-w-md transition-colors max-h-[80vh] overflow-y-auto"
      >
        <h2 className="text-lg font-semibold text-blue-700 dark:text-blue-400 mb-4">
          {roleToEdit ? 'Edit Role' : 'Add New Role'}
        </h2>

        {/* Role Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Role Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-800 dark:text-white dark:border-gray-700"
            placeholder="Enter role name"
            required
          />
        </div>

        {/* Permissions */}
        <div className="mb-6">
          <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2">
            Permissions
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FEATURES.map(({ name: featureName, subPermissions }) => {
              const expanded = expandedFeatures[featureName] || false;
              return (
                <div key={featureName} className="border rounded p-3 bg-gray-50 dark:bg-gray-800">
                  <label className="flex items-center gap-2 font-semibold text-gray-800 dark:text-white mb-2">
                    <input
                      type="checkbox"
                      ref={(el) => {
                        if (el) {
                          el.indeterminate = isIndeterminate(featureName, subPermissions);
                        }
                      }}
                      checked={isChecked(featureName, subPermissions)}
                      onChange={() => toggleParent(featureName, subPermissions)}
                      className="accent-blue-600 dark:accent-blue-500"
                    />
                    {featureName}
                  </label>
                  {expanded && (
                    <div className="ml-4 space-y-1">
                      {subPermissions.map((perm) => (
                        <label
                          key={perm}
                          className="flex items-center gap-2 text-[12px] text-gray-700 dark:text-gray-200"
                        >
                          <input
                            type="checkbox"
                            checked={permissions[featureName]?.includes(perm) || false}
                            onChange={() => toggleChild(featureName, perm)}
                            className="accent-blue-600 dark:accent-blue-500"
                          />
                          {perm}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 dark:bg-gray-700 dark:text-white rounded hover:bg-gray-400 dark:hover:bg-gray-600 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            {roleToEdit ? 'Update Role' : 'Create Role'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default RoleModal;

