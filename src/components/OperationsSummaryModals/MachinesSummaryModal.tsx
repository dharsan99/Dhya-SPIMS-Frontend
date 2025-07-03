import React from 'react';

interface MachineStatus {
  machine_id: string;
  machine_name: string;
  status: 'running' | 'idle' | 'maintenance' | 'offline';
  efficiency: number;
  current_order?: string;
}

interface MachinesSummaryModalProps {
  open: boolean;
  onClose: () => void;
  data: {
    totalMachines: number;
    runningMachines: number;
    idleMachines: number;
    maintenanceMachines: number;
    offlineMachines: number;
    machineStatuses: MachineStatus[];
  };
}

const MachinesSummaryModal: React.FC<MachinesSummaryModalProps> = ({ open, onClose, data }) => {
  if (!open) return null;

  const getStatusColor = (status: MachineStatus['status']) => {
    switch (status) {
      case 'running': return 'bg-green-50 text-green-700';
      case 'idle': return 'bg-yellow-50 text-yellow-700';
      case 'maintenance': return 'bg-red-50 text-red-700';
      case 'offline': return 'bg-gray-50 text-gray-700';
    }
  };

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-sm bg-white/10 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Machines Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-2xl font-bold px-2" aria-label="Close">&times;</button>
        </div>
        <div className="text-gray-700 dark:text-gray-200 mb-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-sm text-blue-700">Total Machines</div>
                <div className="text-xl font-semibold">{data.totalMachines}</div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="text-sm text-green-700">Running</div>
                <div className="text-xl font-semibold">{data.runningMachines}</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-yellow-50 p-3 rounded-lg">
                <div className="text-sm text-yellow-700">Idle</div>
                <div className="text-xl font-semibold">{data.idleMachines}</div>
              </div>
              <div className="bg-red-50 p-3 rounded-lg">
                <div className="text-sm text-red-700">Maintenance</div>
                <div className="text-xl font-semibold">{data.maintenanceMachines}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-700">Offline</div>
                <div className="text-xl font-semibold">{data.offlineMachines}</div>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Machine Status</h3>
              <div className="space-y-2">
                {(data.machineStatuses ?? []).map((machine) => (
                  <div key={machine.machine_id} className="flex justify-between items-center p-2 rounded">
                    <div>
                      <div className="font-medium">{machine.machine_name}</div>
                      {machine.current_order && (
                        <div className="text-sm text-gray-600">Order: {machine.current_order}</div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-sm ${getStatusColor(machine.status)}`}>
                        {machine.status}
                      </span>
                      <span className="text-sm font-medium">{machine.efficiency}%</span>
                    </div>
                  </div>
                ))}
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

export default MachinesSummaryModal; 