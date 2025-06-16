import { useState, useEffect } from 'react';
import { FiPlus } from 'react-icons/fi';
import EmployeeModal from '../components/Employees/EmployeeModal';
import EmployeeTable from '../components/Employees/EmployeeTable';
import AttendanceTab from '../components/Employees/attendance/AttendanceTab';
import { Employee } from '../types/employee';
import {
  getAllEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from '../api/employees';
import Loader from '../components/Loader';
import useAuthStore from '@/hooks/auth';

const Employees = () => {
  const [activeTab, setActiveTab] = useState<'employees' | 'attendance'>('attendance');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const hasPermission = useAuthStore((state) => state.hasPermission);
  const canViewAttendance = hasPermission('Attendance', 'View Attendance'); 

  const fetchEmployees = async () => {
    try {
      const res = await getAllEmployees();
      setEmployees(res);
    } catch (err) {
      // ... removed all console.error ...
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleEdit = (emp: Employee) => {
    setEditingEmployee(emp);
    setModalOpen(true);
  };

  const handleSave = async (data: Omit<Employee, 'id'>, id?: string) => {
    try {
      if (id) {
        await updateEmployee(id, data);
      } else {
        await createEmployee(data);
      }
      await fetchEmployees();
    } catch (err) {
      // ... removed all console.error ...
    } finally {
      setModalOpen(false);
    }
  };

  const handleDelete = (id: string) => {
    setConfirmDeleteId(id);
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6 transition-colors duration-300">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-blue-600 dark:text-blue-400">Employees</h1>

        {activeTab === 'employees' && (
          <button
            onClick={() => {
              setEditingEmployee(null);
              setModalOpen(true);
            }}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
          >
            <FiPlus className="w-5 h-5" />
            Add Employee
          </button>
        )}
      </div>

      {/* Tab Switcher */}
      <div className="flex border-b mb-6 space-x-4">
  {canViewAttendance && (
    <button
      className={`pb-2 px-2 border-b-2 transition ${
        activeTab === 'attendance'
          ? 'border-blue-600 text-blue-600'
          : 'border-transparent text-gray-500 dark:text-gray-400'
      }`}
      onClick={() => setActiveTab('attendance')}
    >
      Attendance
    </button>
  )}
  <button
    className={`pb-2 px-2 border-b-2 transition ${
      activeTab === 'employees'
        ? 'border-blue-600 text-blue-600'
        : 'border-transparent text-gray-500 dark:text-gray-400'
    }`}
    onClick={() => setActiveTab('employees')}
  >
    Employees
  </button>
</div>


      {/* Tab Views */}
      {activeTab === 'employees' && (
        <EmployeeTable
          employees={employees}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

{activeTab === 'attendance' && canViewAttendance && <AttendanceTab />}
{activeTab === 'attendance' && !canViewAttendance && (
  <div className="p-4 text-red-500 dark:text-red-400">
    You do not have permission to view attendance.
  </div>
)}
      {/* Modal for Create/Edit Employee */}
      <EmployeeModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialData={editingEmployee || undefined}
        onSave={handleSave}
      />

      {/* Confirmation Modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
              Confirm Deletion
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to delete this employee? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white rounded hover:bg-gray-400 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  try {
                    await deleteEmployee(confirmDeleteId);
                    setConfirmDeleteId(null);
                    await fetchEmployees();
                  } catch (err) {
                    // ... removed all console.error ...
                  }
                }}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;