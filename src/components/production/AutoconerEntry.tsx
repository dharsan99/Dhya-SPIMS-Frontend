import React, { useState, useEffect } from 'react';
import { useProductionStore, AutoconerEntry as AutoconerEntryType } from '../../stores/productionStore';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

type ShiftNumber = 1 | 2 | 3;
type ShiftField = `shift${ShiftNumber}`;
type ShiftOrderField = `shift${ShiftNumber}OrderId`;

type ErrorState = {
  [key: string]: {
    [field in keyof AutoconerEntryType]?: string;
  };
};

interface Props {
  defaultOrderId: string;
  availableOrders: any[];
}

const getInitialMachine = (defaultOrderId: string): AutoconerEntryType => ({
  shift1: 0,
  shift2: 0,
  shift3: 0,
  shift1OrderId: defaultOrderId,
  shift2OrderId: defaultOrderId,
  shift3OrderId: defaultOrderId
});

const AutoconerEntry: React.FC<Props> = ({ defaultOrderId, availableOrders }) => {
  const { autoconer, setAutoconer } = useProductionStore();
  const [errors, setErrors] = useState<ErrorState>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  // Initialize both machines if they don't exist or update order IDs if needed
  useEffect(() => {
    if (!autoconer || autoconer.length < 2) {
      const initialAutoconer = Array(2).fill(null).map(() => getInitialMachine(defaultOrderId));
      setAutoconer(initialAutoconer);
    } else {
      // Only update if any shiftOrderId is missing
      const needsUpdate = autoconer.some(machine =>
        !machine.shift1OrderId || !machine.shift2OrderId || !machine.shift3OrderId
      );
      if (needsUpdate) {
        const updatedAutoconer = autoconer.map(machine => ({
          ...machine,
          shift1OrderId: machine.shift1OrderId || defaultOrderId,
          shift2OrderId: machine.shift2OrderId || defaultOrderId,
          shift3OrderId: machine.shift3OrderId || defaultOrderId
        }));
        setAutoconer(updatedAutoconer);
      }
    }
  }, [defaultOrderId]);

  const handleValueChange = (machineIndex: number, shift: ShiftNumber, value: string) => {
    const numValue = parseFloat(value) || 0;
    const newAutoconer = [...(autoconer || Array(2).fill(null).map(() => getInitialMachine(defaultOrderId)))];
    
    if (!newAutoconer[machineIndex]) {
      newAutoconer[machineIndex] = getInitialMachine(defaultOrderId);
    }
    
    const shiftKey = `shift${shift}` as ShiftField;
    const shiftOrderKey = `shift${shift}OrderId` as ShiftOrderField;
    
    newAutoconer[machineIndex] = {
      ...newAutoconer[machineIndex],
      [shiftKey]: numValue,
      [shiftOrderKey]: numValue > 0 ? (newAutoconer[machineIndex][shiftOrderKey] || defaultOrderId) : newAutoconer[machineIndex][shiftOrderKey]
    };
    
    setAutoconer(newAutoconer);
    validateField(machineIndex, shiftKey, numValue);
  };

  const handleOrderChange = (machineIndex: number, shift: ShiftNumber, orderId: string) => {
    const newAutoconer = [...(autoconer || Array(2).fill(null).map(() => getInitialMachine(defaultOrderId)))];
    
    if (!newAutoconer[machineIndex]) {
      newAutoconer[machineIndex] = getInitialMachine(defaultOrderId);
    }
    
    const shiftOrderKey = `shift${shift}OrderId` as ShiftOrderField;
    newAutoconer[machineIndex] = {
      ...newAutoconer[machineIndex],
      [shiftOrderKey]: orderId || defaultOrderId
    };
    
    setAutoconer(newAutoconer);
  };

  const handleBlur = (machineIndex: number, shift: ShiftNumber) => {
    const touchKey = `${machineIndex}-${shift}`;
    setTouched(prev => ({ ...prev, [touchKey]: true }));
    const shiftKey = `shift${shift}` as ShiftField;
    const value = autoconer?.[machineIndex]?.[shiftKey];
    validateField(machineIndex, shiftKey, value);
  };

  const validateField = (machineIndex: number, field: keyof AutoconerEntryType, value: any) => {
    const newErrors = { ...errors };
    if (!newErrors[machineIndex]) {
      newErrors[machineIndex] = {};
    }

    if (field.startsWith('shift') && !field.includes('OrderId')) {
      if (value < 0) {
        newErrors[machineIndex][field] = 'Value cannot be negative';
      } else {
        delete newErrors[machineIndex][field];
      }
    }

    setErrors(newErrors);
  };

  const isValid = (machineIndex: number, shift: ShiftNumber) => {
    const row = autoconer?.[machineIndex];
    if (!row) return false;
    
    const shiftKey = `shift${shift}` as ShiftField;
    const shiftOrderKey = `shift${shift}OrderId` as ShiftOrderField;
    const qty = row[shiftKey] as number;
    const orderId = row[shiftOrderKey];
    return qty >= 0 && !!orderId && !errors[machineIndex]?.[shiftKey];
  };

  const calculateTotal = (machineIndex: number) => {
    const row = autoconer?.[machineIndex];
    if (!row) return 0;
    return (row.shift1 || 0) + (row.shift2 || 0) + (row.shift3 || 0);
  };

  return (
    <div className="space-y-4">
      {[0, 1].map((machineIndex) => (
        <div key={machineIndex} className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {machineIndex + 1} M/C
          </h3>

          <div className="flex flex-col md:flex-row gap-4 mb-2">
            {[1, 2, 3].map((shift) => {
              const shiftNum = shift as ShiftNumber;
              const touchKey = `${machineIndex}-${shift}`;
              const active = touched[touchKey];
              const shiftKey = `shift${shift}` as ShiftField;
              const shiftOrderKey = `shift${shift}OrderId` as ShiftOrderField;
              const currentOrderId = autoconer?.[machineIndex]?.[shiftOrderKey];
              
              return (
                <div
                  key={shift}
                  className={`relative flex-1 flex flex-col items-center rounded-xl p-4 shadow-sm border transition-all duration-150 ${
                    active ? 'border-blue-400 shadow-md' : 'border-gray-200'
                  } ${isValid(machineIndex, shiftNum) ? 'border-green-500' : ''} bg-white`}
                  tabIndex={0}
                  aria-label={`Shift ${shift} entry`}
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <span className="font-semibold text-gray-700 text-sm">Shift {shift}</span>
                    {isValid(machineIndex, shiftNum) && (
                      <CheckCircleIcon className="w-5 h-5 text-green-500" aria-label="Valid" />
                    )}
                  </div>
                  <label htmlFor={`m${machineIndex}-shift${shift}-qty`} className="text-xs text-gray-500 mb-1 w-full text-left">
                    Qty (kgs)
                  </label>
                  <input
                    id={`m${machineIndex}-shift${shift}-qty`}
                    type="number"
                    min="0"
                    step="0.01"
                    aria-label={`Quantity for Machine ${machineIndex + 1} Shift ${shift}`}
                    className={`w-full px-3 py-2 border rounded text-center text-lg font-semibold focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition-all ${
                      errors[machineIndex]?.[shiftKey] ? 'border-red-500' : 'border-gray-300'
                    }`}
                    value={autoconer?.[machineIndex]?.[shiftKey] ?? 0}
                    onChange={(e) => handleValueChange(machineIndex, shiftNum, e.target.value)}
                    onBlur={() => handleBlur(machineIndex, shiftNum)}
                    placeholder="0"
                    autoComplete="off"
                  />
                  {errors[machineIndex]?.[shiftKey] && touched[touchKey] && (
                    <span className="text-xs text-red-500 mt-1 w-full text-left">
                      {errors[machineIndex][shiftKey]}
                    </span>
                  )}
                  <select
                    aria-label={`Sales Order for Machine ${machineIndex + 1} Shift ${shift}`}
                    className="w-full mt-2 px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500"
                    value={currentOrderId || ''}
                    onChange={(e) => handleOrderChange(machineIndex, shiftNum, e.target.value)}
                  >
                    <option value="">Select SO</option>
                    {availableOrders.map((order) => (
                      <option key={order.id} value={order.id}>
                        {`${order.order_number} - ${order.shade?.shade_name}`}
                      </option>
                    ))}
                  </select>
                </div>
              );
            })}
          </div>
          <div className="mt-2 font-medium text-gray-800 text-base">
            Total: {calculateTotal(machineIndex).toFixed(2)} kgs
          </div>
        </div>
      ))}
    </div>
  );
};

export default AutoconerEntry; 