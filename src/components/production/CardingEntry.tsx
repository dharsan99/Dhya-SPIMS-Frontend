import React, { useState, useEffect } from 'react';
import { useProductionStore, MachineShiftEntry } from '../../stores/productionStore';
import { CheckCircleIcon, PencilIcon, XMarkIcon } from '@heroicons/react/24/solid';

interface CardingEntryProps {
  defaultOrderId: string;
  availableOrders: any[];
  isEditMode?: boolean;
  onSave?: () => void;
  onCancel?: () => void;
}

const CardingEntry: React.FC<CardingEntryProps> = ({ 
  defaultOrderId, 
  availableOrders, 
  isEditMode = false,
  onSave,
  onCancel 
}) => {
  const { carding, setCarding } = useProductionStore();
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [localCarding, setLocalCarding] = useState<MachineShiftEntry[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize local state when component mounts or carding changes
  useEffect(() => {
    setLocalCarding(carding);
  }, [carding]);

  // Initialize shift order IDs with defaultOrderId when component mounts
  useEffect(() => {
    if (defaultOrderId && !isEditMode) {
      const initializedCarding = localCarding.map(machine => {
        if (!machine.shift1OrderId && !machine.shift2OrderId && !machine.shift3OrderId) {
          return {
            ...machine,
            shift1OrderId: defaultOrderId,
            shift2OrderId: defaultOrderId,
            shift3OrderId: defaultOrderId
          };
        }
        return machine;
      });
      setLocalCarding(initializedCarding);
    }
  }, [defaultOrderId, isEditMode]);

  // Add this useEffect after imports and before the component return
  useEffect(() => {
    if (localCarding.length === 0 && defaultOrderId) {
      const defaultMachines = Array.from({ length: 3 }, () => ({
        shift1: 0,
        shift2: 0,
        shift3: 0,
        shift1OrderId: defaultOrderId,
        shift2OrderId: defaultOrderId,
        shift3OrderId: defaultOrderId,
      }));
      setLocalCarding(defaultMachines);
      setCarding(defaultMachines); // Optionally update the store as well
    }
  }, [localCarding, defaultOrderId, setCarding]);

  const handleValueChange = (machineIdx: number, shift: number, value: number) => {
    const updated = localCarding.map((machine, idx) => {
      if (idx === machineIdx) {
        return {
          ...machine,
          [`shift${shift}`]: value,
          [`shift${shift}OrderId`]: value > 0 ? (machine[`shift${shift}OrderId` as keyof MachineShiftEntry] || defaultOrderId) : machine[`shift${shift}OrderId` as keyof MachineShiftEntry]
        };
      }
      return machine;
    });
    setLocalCarding(updated);
    setHasChanges(true);
    
    // Auto-save to store if not in edit mode
    if (!isEditMode && isSectionValid()) {
      setCarding(updated);
    }
  };

  const handleOrderChange = (machineIdx: number, shift: number, orderId: string) => {
    const updated = localCarding.map((machine, idx) =>
      idx === machineIdx ? { ...machine, [`shift${shift}OrderId`]: orderId || undefined } : machine
    );
    setLocalCarding(updated);
    setHasChanges(true);
  };

  const handleBlur = (machineIdx: number, shift: number) => {
    const key = `${machineIdx}-${shift}`;
    setTouched(prev => ({ ...prev, [key]: true }));
    
    const value = Number(localCarding[machineIdx][`shift${shift}` as keyof MachineShiftEntry]);
    if (touched[key] && (isNaN(value) || value < 0)) {
      setErrors(prev => ({ ...prev, [key]: 'Enter a valid quantity' }));
    } else {
      setErrors(prev => ({ ...prev, [key]: '' }));
      
      // Auto-save to store if not in edit mode and section is valid
      if (!isEditMode && isSectionValid()) {
        setCarding(localCarding);
      }
    }
  };

  const isValid = (machineIdx: number, shift: number) => {
    const machine = localCarding[machineIdx];
    const qty = Number(machine[`shift${shift}` as keyof MachineShiftEntry]);
    const so = machine[`shift${shift}OrderId` as keyof MachineShiftEntry];
    const key = `${machineIdx}-${shift}`;
    return qty > 0 && !!so && !errors[key];
  };

  const isSectionValid = () => {
    return localCarding.every((machine, machineIdx) => 
      [1, 2, 3].every(shift => {
        const qty = Number(machine[`shift${shift}` as keyof MachineShiftEntry]);
        return qty === 0 || isValid(machineIdx, shift);
      })
    );
  };

  const handleSave = () => {
    if (isSectionValid()) {
      setCarding(localCarding);
      setHasChanges(false);
      onSave?.();
    }
  };

  const handleCancel = () => {
    setLocalCarding(carding);
    setHasChanges(false);
    onCancel?.();
  };

  // Calculate total for each machine
  const getMachineTotal = (machineIdx: number) => {
    const machine = localCarding[machineIdx];
    return [1, 2, 3].reduce((sum, shift) => 
      sum + (Number(machine[`shift${shift}` as keyof MachineShiftEntry]) || 0), 0
    );
  };

  return (
    <div className="space-y-6">
      {isEditMode && (
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <PencilIcon className="w-5 h-5 text-blue-500" />
            <span className="text-blue-500 font-medium">Edit Mode</span>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!hasChanges || !isSectionValid()}
              className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                hasChanges && isSectionValid()
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              Save Changes
            </button>
          </div>
        </div>
      )}

      {localCarding.map((machine, machineIdx) => (
        <div key={machineIdx} className="bg-white rounded-lg shadow p-4">
          <div className="font-semibold text-gray-700 mb-3">Machine {machineIdx + 1}</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((shift) => {
              const active = touched[`${machineIdx}-${shift}`];
              const currentOrderId = machine[`shift${shift}OrderId` as keyof MachineShiftEntry];
              return (
                <div
                  key={shift}
                  className={`relative flex flex-col rounded-xl p-4 shadow-sm border transition-all duration-150 
                    ${active ? 'border-blue-400 shadow-md' : 'border-gray-200'} 
                    ${isValid(machineIdx, shift) ? 'border-green-500' : ''} 
                    ${!isValid(machineIdx, shift) && active ? 'border-red-500' : ''}
                    bg-white`}
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <span className="font-semibold text-gray-700 text-sm">Shift {shift}</span>
                    {isValid(machineIdx, shift) && (
                      <CheckCircleIcon className="w-5 h-5 text-green-500" aria-label="Valid" />
                    )}
                    {!isValid(machineIdx, shift) && active && (
                      <XMarkIcon className="w-5 h-5 text-red-500" aria-label="Invalid" />
                    )}
                  </div>
                  
                  <label htmlFor={`machine${machineIdx}-shift${shift}-qty`} className="text-xs text-gray-500 mb-1">
                    Qty (kgs)
                  </label>
                  <input
                    id={`machine${machineIdx}-shift${shift}-qty`}
                    type="number"
                    min="0"
                    className={`w-full px-3 py-2 border rounded text-center text-lg font-semibold 
                      focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition-all
                      ${errors[`${machineIdx}-${shift}`] ? 'border-red-500' : 'border-gray-300'}`}
                    value={machine[`shift${shift}` as keyof MachineShiftEntry] || ''}
                    onChange={e => handleValueChange(machineIdx, shift, Number(e.target.value))}
                    onBlur={() => handleBlur(machineIdx, shift)}
                    placeholder="0"
                    autoComplete="off"
                  />
                  {errors[`${machineIdx}-${shift}`] && touched[`${machineIdx}-${shift}`] && (
                    <span className="text-xs text-red-500 mt-1">{errors[`${machineIdx}-${shift}`]}</span>
                  )}
                  
                  <select
                    className={`w-full mt-3 border rounded focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition-all
                      ${!currentOrderId && active ? 'border-red-500' : 'border-gray-300'}`}
                    value={currentOrderId || ''}
                    onChange={e => handleOrderChange(machineIdx, shift, e.target.value)}
                  >
                    <option value="">Select SO</option>
                    {availableOrders.map(order => (
                      <option key={order.id} value={order.id}>
                        {order.order_number}
                      </option>
                    ))}
                  </select>
                  {!currentOrderId && active && (
                    <span className="text-xs text-red-500 mt-1">Please select a Sales Order</span>
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-2 text-sm text-gray-600">
            Machine Total: {getMachineTotal(machineIdx)} kgs
          </div>
        </div>
      ))}
      <div className="mt-4 font-medium text-gray-800 text-base">
        Total Today: {localCarding.reduce((sum, machine) => sum + getMachineTotal(localCarding.indexOf(machine)), 0)} kgs
      </div>
    </div>
  );
};

export default CardingEntry; 