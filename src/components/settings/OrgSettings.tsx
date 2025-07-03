import useAuthStore from '@/hooks/auth';
import { useState } from 'react';

const OrgSettings = () => {
  const { user: authUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);

  const [userName, setUserName] = useState(authUser?.name || '');
  const [email, setEmail] = useState(authUser?.email || '');

  const handleSave = () => {
    setIsEditing(false);
    alert('User details updated (locally)');
    // Optionally update the backend here
  };

  return (
    <section className="space-y-6 max-w-3xl mx-auto">
      <header>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">User Info</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Manage your personal account details.
        </p>
      </header>

      <div className="bg-white dark:bg-gray-900 border dark:border-gray-700 rounded shadow-sm p-6 transition-colors">
        {!isEditing ? (
          <div className="space-y-4">
            <DetailRow label="Name" value={userName} />
            <DetailRow label="Email" value={email} />
            <div className="flex justify-end">
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Edit
              </button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
            className="space-y-4"
          >
            <InputField
              label="Name"
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
            <InputField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-700 dark:text-white text-gray-700 rounded hover:bg-gray-400 dark:hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};

export default OrgSettings;

// 🔹 Reusable components

const DetailRow = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <div>
    <label className="text-sm text-gray-600 dark:text-gray-400 block mb-1">{label}</label>
    <p className="text-gray-800 dark:text-gray-200">{value}</p>
  </div>
);

const InputField = ({
  label,
  type,
  value,
  onChange,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <div>
    <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      className="w-full border dark:border-gray-600 dark:bg-gray-800 dark:text-white px-3 py-2 rounded"
    />
  </div>
);
