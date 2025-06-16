import React from 'react';

interface WorkforceSummaryModalProps {
  open: boolean;
  onClose: () => void;
  data: {
    totalWorkers: number;
    presentWorkers: number;
    absentWorkers: number;
    attendanceRate: number;
    overtimeHours: number;
    productivityScore: number;
  };
}

const WorkforceSummaryModal: React.FC<WorkforceSummaryModalProps> = ({ open, onClose, data }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 backdrop-blur-sm bg-white/10 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Workforce Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-2xl font-bold px-2" aria-label="Close">&times;</button>
        </div>
        <div className="text-gray-700 dark:text-gray-200 mb-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-sm text-blue-700">Total Workers</div>
                <div className="text-xl font-semibold">{data.totalWorkers}</div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="text-sm text-green-700">Present Today</div>
                <div className="text-xl font-semibold">{data.presentWorkers}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-red-50 p-3 rounded-lg">
                <div className="text-sm text-red-700">Absent Today</div>
                <div className="text-xl font-semibold">{data.absentWorkers}</div>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <div className="text-sm text-purple-700">Attendance Rate</div>
                <div className="text-xl font-semibold">{data.attendanceRate}%</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-yellow-50 p-3 rounded-lg">
                <div className="text-sm text-yellow-700">Overtime Hours</div>
                <div className="text-xl font-semibold">{data.overtimeHours} hrs</div>
              </div>
              <div className="bg-indigo-50 p-3 rounded-lg">
                <div className="text-sm text-indigo-700">Productivity Score</div>
                <div className="text-xl font-semibold">{data.productivityScore}%</div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm">Close</button>
        </div>
      </div>
    </div>
  );
};

export default WorkforceSummaryModal; 