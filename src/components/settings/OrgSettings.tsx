import { useState } from 'react';

const OrgSettings = () => {
  const [isEditing, setIsEditing] = useState(false);

  const [orgName, setOrgName] = useState('Dhya Innovations Pvt Ltd');
  const [contactEmail, setContactEmail] = useState('info@dhya.in');
  const [website, setWebsite] = useState('https://www.dhya.in');
  const [address, setAddress] = useState('Coimbatore, Tamil Nadu, India');

  const handleSave = () => {
    console.log('Saving org settings:', { orgName, contactEmail, website, address });
    setIsEditing(false);
    alert('Organization settings updated successfully');
  };

  return (
    <section className="space-y-6 max-w-3xl mx-auto">
      <header>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Organization Settings</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Manage organization details for your account.
        </p>
      </header>

      <div className="bg-white dark:bg-gray-900 border dark:border-gray-700 rounded shadow-sm p-6 transition-colors">
        {!isEditing ? (
          <div className="space-y-4">
            <DetailRow label="Organization Name" value={orgName} />
            <DetailRow label="Contact Email" value={contactEmail} />
            <DetailRow label="Website" value={<a href={website} className="text-blue-600 dark:text-blue-400 underline">{website}</a>} />
            <DetailRow label="Address" value={address} />
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
              label="Organization Name"
              type="text"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
            />
            <InputField
              label="Contact Email"
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
            />
            <InputField
              label="Website URL"
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
            <TextAreaField
              label="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
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

const TextAreaField = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}) => (
  <div>
    <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">{label}</label>
    <textarea
      rows={3}
      value={value}
      onChange={onChange}
      className="w-full border dark:border-gray-600 dark:bg-gray-800 dark:text-white px-3 py-2 rounded"
    />
  </div>
);