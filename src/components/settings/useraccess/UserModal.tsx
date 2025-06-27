import { useEffect, useState } from 'react';
import { Role, User } from '../../../types/user';
import Modal from '@/components/Modal';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: Omit<User, 'id'> & { id?: string; password?: string }) => void;
  userToEdit?: User | null;
  roles: Role[];
}

const UserModal = ({ isOpen, onClose, onSave, userToEdit, roles }: UserModalProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [roleId, setRoleId] = useState('');
  const [password, setPassword] = useState('');
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (userToEdit) {
      setName(userToEdit.name);
      setEmail(userToEdit.email);
      setRoleId(userToEdit.role_id);
      setIsActive(userToEdit.is_active ?? true);
    } else {
      setName('');
      setEmail('');
      setRoleId('');
      setPassword('');
      setIsActive(true);
    }
  }, [userToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !roleId) {
      alert('Name, Email, and Role are required.');
      return;
    }

    if (userToEdit) {
      onSave({
        id: userToEdit.id,
        name: name.trim(),
        email: email.trim(),
        role_id: roleId,
        is_active: isActive,
      });
    } else {
      onSave({
        name: name.trim(),
        email: email.trim(),
        password: password.trim(),
        role_id: roleId,
        is_active: isActive,
      });
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-lg font-semibold text-blue-700 dark:text-blue-400">
          {userToEdit ? 'Edit User' : 'Add User'}
        </h2>

        {/* Name */}
        <div>
          <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Name</label>
          <input
            type="text"
            className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Email</label>
          <input
            type="email"
            className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Password – only when creating */}
        {!userToEdit && (
          <div>
            <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Password</label>
            <input
              type="password"
              className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        )}

        {/* Role */}
        <div>
          <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Role</label>
          <select
            className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={roleId}
            onChange={(e) => setRoleId(e.target.value)}
            required
          >
            <option value="">Select Role</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
        </div>

        {/* Active checkbox */}
        <div className="flex items-center gap-2 mt-2">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="accent-blue-600"
          />
          <label className="text-sm text-gray-700 dark:text-gray-300">Active</label>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 dark:bg-gray-700 dark:text-white rounded hover:bg-gray-400 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            {userToEdit ? 'Update' : 'Save'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default UserModal;
