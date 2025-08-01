import { useState } from 'react';
import { toast } from 'sonner';
import Modal from '@/components/Modal';
import { sendInvite } from '@/api/signup';
import Select from 'react-select';


interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  roles: { id: string; name: string }[];
  tenantId: string;
}

const InviteModal = ({ isOpen, onClose, roles, tenantId }: InviteModalProps) => {
  const [email, setEmail] = useState('');
  const [roleId, setRoleId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  console.log('roles', roles)

  const handleInvite = async () => {
    if (!email || !roleId) {
      toast.error('Email and role are required.');
      return;
    }
    setIsLoading(true);
    try {
      await sendInvite({ email,  roleId, tenantId });
      toast.success('Invitation sent!');
      setEmail('');
      setRoleId('');
      onClose();
    } catch (err) {
      console.error(err);
      toast.error('Failed to send invite.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal onClose={onClose}>
      <h2 className="text-lg font-bold mb-4 text-gray-900">Invite Teammate</h2>

      <div className="space-y-4">
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border rounded bg-white text-gray-900"
        />

        <Select
          value={roles.find((role) => role.id === roleId) ? { value: roleId, label: roles.find((role) => role.id === roleId)?.name } : null}
          onChange={(option) => setRoleId(option ? option.value : '')}
          options={roles.map((role) => ({ value: role.id, label: role.name }))}
          placeholder="Select Role"
          classNamePrefix="react-select"
        />

        <div className="flex justify-end gap-2 pt-2">
          <button onClick={onClose} className="px-4 py-2 text-gray-700 border rounded">
            Cancel
          </button>
          <button
            onClick={handleInvite}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center justify-center min-w-[110px]"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
               <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Sending...
              </>
            ) : (
              'Send Invite'
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default InviteModal;