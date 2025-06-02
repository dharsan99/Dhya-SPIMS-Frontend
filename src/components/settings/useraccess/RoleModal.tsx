import { useEffect, useState } from 'react';
import Modal from '../../Modal';

interface RoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { id?: string; name: string; permissions: string[] }) => void;
  roleToEdit?: { id: string; name: string; permissions: string[] } | null;
}

const FEATURES = [
  'Orders',
  'Shades',
  'Fibres',
  'Production',
  'Buyers',
  'Suppliers',
  'Settings',
];

const RoleModal = ({ isOpen, onClose, onSave, roleToEdit }: RoleModalProps) => {
  const [name, setName] = useState('');
  const [permissions, setPermissions] = useState<string[]>([]);

  useEffect(() => {
    if (roleToEdit) {
      setName(roleToEdit.name);
      setPermissions(roleToEdit.permissions);
    } else {
      setName('');
      setPermissions([]);
    }
  }, [roleToEdit, isOpen]);

  const handleToggle = (feature: string) => {
    setPermissions((prev) =>
      prev.includes(feature)
        ? prev.filter((f) => f !== feature)
        : [...new Set([...prev, feature])]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) return;

    onSave({ id: roleToEdit?.id, name: trimmedName, permissions });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal onClose={onClose}>
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-900 rounded shadow p-6 w-full max-w-md transition-colors"
      >
        <h2 className="text-lg font-semibold text-blue-700 dark:text-blue-400 mb-4">
          {roleToEdit ? 'Edit Role' : 'Add New Role'}
        </h2>

        {/* Name Field */}
        <div className="mb-4">
          <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
            Role Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Permissions */}
        <div className="mb-6">
          <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2">
            Permissions
          </label>
          <div className="grid grid-cols-2 gap-2">
            {FEATURES.map((feature) => (
              <label key={feature} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                <input
                  type="checkbox"
                  checked={permissions.includes(feature)}
                  onChange={() => handleToggle(feature)}
                  className="accent-blue-600 dark:accent-blue-500"
                />
                {feature}
              </label>
            ))}
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