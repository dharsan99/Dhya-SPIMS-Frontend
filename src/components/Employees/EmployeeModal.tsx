import React, { useEffect, useState } from 'react';
import { Employee, CreateEmployeeInput } from '../../types/employee';
import { showError } from './attendance/utils/toastutils';
import CreatableSelect from 'react-select/creatable';
import { useQuery } from '@tanstack/react-query';
import { getDepartments } from '@/api/attendance';
import { FiUser, FiDollarSign, FiCreditCard, FiCalendar, FiX, FiSave } from 'react-icons/fi';

interface EmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateEmployeeInput, id?: string) => void;
  initialData?: Employee | null;
}

const EmployeeModal: React.FC<EmployeeModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState<CreateEmployeeInput>({
    name: '',
    aadharNo: '',
    bankAcc1: '',
    bankAcc2: '',
    department: '',
    joinDate: '',
    shiftRate: 0,
  });

  const { data: departmentOptions = [], isLoading: departmentsLoading, isError: departmentsError } = useQuery({
    queryKey: ['departments'],
    queryFn: getDepartments,
  });

  useEffect(() => {
    if (initialData) {
      // Convert from Employee format to CreateEmployeeInput format
      setFormData({
        name: initialData.name,
        aadharNo: initialData.aadharNo,
        bankAcc1: initialData.bankAcc1,
        bankAcc2: initialData.bankAcc2 ?? '',
        department: initialData.department ?? '',
        joinDate: initialData.joinDate ?? '',
        shiftRate: Number(initialData.shiftRate),
      });
    } else {
      setFormData({
        name: '',
        aadharNo: '',
        bankAcc1: '',
        bankAcc2: '',
        department: '',
        joinDate: '',
        shiftRate: 0,
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'shiftRate' ? Number(value) : value,
    }));
  };

  const validateForm = (data: CreateEmployeeInput) => {
    const cleanedAadhar = data.aadharNo.replace(/\D/g, ''); // remove all non-digit characters
  
    if (cleanedAadhar.length !== 12) {
      return 'Aadhar number must be exactly 12 digits.';
    }
  
    if (data.shiftRate <= 0) {
      return 'Shift rate must be a positive number.';
    }

    if (!/^\d+$/.test(data.bankAcc1)) {
      return 'Bank Account 1 must contain only digits.';
    }
  
    if (data.bankAcc1.length < 9 || data.bankAcc1.length > 18) {
      return 'Bank Account 1 must be between 9 and 18 digits.';
    }
  
    if (data.bankAcc2) {
      if (!/^\d+$/.test(data.bankAcc2)) {
        return 'Bank Account 2 must contain only digits.';
      }
      if (data.bankAcc2.length < 9 || data.bankAcc2.length > 18) {
        return 'Bank Account 2 must be between 9 and 18 digits.';
      }
    }
  
    return null;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const error = validateForm(formData);
    if (error) {
      showError(error);
      return;
    }
    onSave(formData, initialData?.id);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[70vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <FiUser className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  {initialData ? 'Edit Employee' : 'Add New Employee'}
                </h2>
                <p className="text-blue-100 text-sm">
                  {initialData ? 'Update employee information' : 'Enter employee details'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information Section */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
              <div className="flex items-center space-x-2 mb-4">
                <FiUser className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Personal Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Full Name *
                  </label>
                  <div className="relative">
                    <input
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter employee name"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Aadhar Number *
                  </label>
                  <div className="relative">
                    <input
                      name="aadharNo"
                      type="text"
                      value={formData.aadharNo}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="12-digit Aadhar number"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Information Section */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
              <div className="flex items-center space-x-2 mb-4">
                <FiDollarSign className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Financial Details</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Shift Rate (₹) *
                  </label>
                  <div className="relative">
                    <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      name="shiftRate"
                      type="number"
                      value={formData.shiftRate}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Joining Date
                  </label>
                  <div className="relative">
                    <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      name="joinDate"
                      type="date"
                      value={formData.joinDate}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bank Information Section */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
              <div className="flex items-center space-x-2 mb-4">
                <FiCreditCard className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Bank Account Details</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Primary Account *
                  </label>
                  <div className="relative">
                    <FiCreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      name="bankAcc1"
                      type="text"
                      value={formData.bankAcc1}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Account number"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Secondary Account
                  </label>
                  <div className="relative">
                    <FiCreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      name="bankAcc2"
                      type="text"
                      value={formData.bankAcc2}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Optional account number"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Department Section */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
              <div className="flex items-center space-x-2 mb-4">
                <FiCalendar className="w-5 h-5 text-orange-600" />
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Department</h3>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Department
                </label>
                <CreatableSelect
                  name="department"
                  options={departmentOptions.map((d) => ({ label: d, value: d }))}
                  value={formData.department ? { label: formData.department, value: formData.department } : null}
                  onChange={(option) => setFormData((prev) => ({ ...prev, department: option ? option.value : '' }))}
                  onCreateOption={(inputValue) => setFormData((prev) => ({ ...prev, department: inputValue }))}
                  isClearable
                  isLoading={departmentsLoading}
                  placeholder={departmentsLoading ? 'Loading departments...' : 'Select or create department'}
                  classNamePrefix="react-select"
                  menuPlacement='top'
                  styles={{
                    control: (base) => ({
                      ...base,
                      minHeight: '48px',
                      borderColor: '#d1d5db',
                      '&:hover': {
                        borderColor: '#3b82f6'
                      }
                    }),
                    menu: (base) => ({
                      ...base,
                      zIndex: 9999
                    })
                  }}
                />
                {departmentsError && (
                  <div className="text-red-500 text-xs mt-1 flex items-center space-x-1">
                    <span>⚠</span>
                    <span>Failed to load departments</span>
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Footer Actions */}
        <div className="bg-gray-50 dark:bg-gray-800 px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium flex items-center space-x-2"
            >
              <FiSave className="w-4 h-4" />
              <span>{initialData ? 'Update Employee' : 'Create Employee'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeModal;