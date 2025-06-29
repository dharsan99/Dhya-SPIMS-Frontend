import React, { useEffect, useState } from 'react';
import { Employee } from '../../types/employee';

interface EmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Employee, 'id'>, id?: string) => void;
  initialData?: Employee | null;
}

const EmployeeModal: React.FC<EmployeeModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState<Omit<Employee, 'id'>>({
    name: '',
    token_no: '',
    shift_rate: 0,
    aadhar_no: '',
    bank_acc_1: '',
    bank_acc_2: '',
    department: '',
    join_date: '', // optional
  });

  useEffect(() => {
    if (initialData) {
      const { id, ...rest } = initialData;
      setFormData({
        ...rest,
        bank_acc_2: rest.bank_acc_2 ?? '',
        department: rest.department ?? '',
        join_date: rest.join_date ?? '',
      });
    } else {
      setFormData({
        name: '',
        token_no: '',
        shift_rate: 0,
        aadhar_no: '',
        bank_acc_1: '',
        bank_acc_2: '',
        department: '',
        join_date: '',
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'shift_rate' ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData, initialData?.id);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-xl w-full max-w-xl">
        <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">
          {initialData ? 'Edit Employee Record' : 'Add New Employee'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Personal Info */}
          <div>
            <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Personal Details</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-300">Name</label>
                <input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 mt-1 border rounded bg-white dark:bg-gray-800 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-300">Token Number</label>
                <input
                  name="token_no"
                  type="text"
                  value={formData.token_no}
                  onChange={handleChange}
                  className="w-full p-2 mt-1 border rounded bg-white dark:bg-gray-800 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-300">Shift Rate</label>
                <input
                  name="shift_rate"
                  type="number"
                  value={formData.shift_rate}
                  onChange={handleChange}
                  className="w-full p-2 mt-1 border rounded bg-white dark:bg-gray-800 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-300">Aadhar Number</label>
                <input
                  name="aadhar_no"
                  type="text"
                  value={formData.aadhar_no}
                  onChange={handleChange}
                  className="w-full p-2 mt-1 border rounded bg-white dark:bg-gray-800 dark:text-white"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 2: Bank Info */}
          <div>
            <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Bank Details</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-300">Bank Account 1</label>
                <input
                  name="bank_acc_1"
                  type="text"
                  value={formData.bank_acc_1}
                  onChange={handleChange}
                  className="w-full p-2 mt-1 border rounded bg-white dark:bg-gray-800 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-300">Bank Account 2 (Optional)</label>
                <input
                  name="bank_acc_2"
                  type="text"
                  value={formData.bank_acc_2}
                  onChange={handleChange}
                  className="w-full p-2 mt-1 border rounded bg-white dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Other */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-300">Department (Optional)</label>
              <input
                name="department"
                type="text"
                value={formData.department}
                onChange={handleChange}
                className="w-full p-2 mt-1 border rounded bg-white dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-300">Joining Date (Optional)</label>
              <input
                name="join_date"
                type="date"
                value={formData.join_date}
                onChange={handleChange}
                className="w-full p-2 mt-1 border rounded bg-white dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white px-4 py-2 rounded hover:bg-gray-400 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
            >
              {initialData ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeModal;