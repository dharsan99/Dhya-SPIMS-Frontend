import React, { useState, useEffect } from 'react';
import { useProductionStore, MachineShiftEntry } from '../../stores/productionStore';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

interface FramingEntryProps {
  defaultOrderId: string;
  availableOrders: any[];
}

const FramingEntry: React.FC<FramingEntryProps> = ({ defaultOrderId, availableOrders }) => {
  const { framing, setFraming } = useProductionStore();
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Initialize shift order IDs with defaultOrderId when component mounts
  useEffect(() => {
    if (defaultOrderId) {
      const initializedFraming = framing.map(machine => {
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
      setFraming(initializedFraming);
    }
  }, [defaultOrderId]);

  const handleValueChange = (machineIdx: number, shift: number, value: number) => {
    const updated = framing.map((machine, idx) => {
      if (idx === machineIdx) {
        return {
          ...machine,
          [`shift${shift}`]: value,
          // Set the order ID to defaultOrderId if there's a quantity but no order ID
          [`shift${shift}OrderId`]: value > 0 ? (machine[`shift${shift}OrderId` as keyof MachineShiftEntry] || defaultOrderId) : machine[`shift${shift}OrderId` as keyof MachineShiftEntry]
        };
      }
      return machine;
    });
    setFraming(updated);
  };

  const handleOrderChange = (machineIdx: number, shift: number, orderId: string) => {
    const updated = framing.map((machine, idx) =>
      idx === machineIdx ? { ...machine, [`shift${shift}OrderId`]: orderId || undefined } : machine
    );
    setFraming(updated);
  };

  const handleBlur = (machineIdx: number, shift: number) => {
    const key = `${machineIdx}-${shift}`;
    setTouched(prev => ({ ...prev, [key]: true }));
    
    const value = Number(framing[machineIdx][`shift${shift}` as keyof MachineShiftEntry]);
    if (touched[key] && (isNaN(value) || value < 0)) {
      setErrors(prev => ({ ...prev, [key]: 'Enter a valid quantity' }));
    } else {
      setErrors(prev => ({ ...prev, [key]: '' }));
    }
  };

  const isValid = (machineIdx: number, shift: number) => {
    const machine = framing[machineIdx];
    const qty = Number(machine[`shift${shift}` as keyof MachineShiftEntry]);
    const so = machine[`shift${shift}OrderId` as keyof MachineShiftEntry];
    const key = `${machineIdx}-${shift}`;
    return qty > 0 && !!so && !errors[key];
  };

  // Calculate total for each machine
  const getMachineTotal = (machineIdx: number) => {
    const machine = framing[machineIdx];
    return [1, 2, 3].reduce((sum, shift) => 
      sum + (Number(machine[`shift${shift}` as keyof MachineShiftEntry]) || 0), 0
    );
  };

  return (
    <div className="space-y-6">
      {framing.map((machine, machineIdx) => (
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
                    bg-white`}
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <span className="font-semibold text-gray-700 text-sm">Shift {shift}</span>
                    {isValid(machineIdx, shift) && (
                      <CheckCircleIcon className="w-5 h-5 text-green-500" aria-label="Valid" />
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
                    className="w-full mt-3 border rounded focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition-all"
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
        Total Today: {framing.reduce((sum, machine) => sum + getMachineTotal(framing.indexOf(machine)), 0)} kgs
      </div>
    </div>
  );
};

export default FramingEntry; 