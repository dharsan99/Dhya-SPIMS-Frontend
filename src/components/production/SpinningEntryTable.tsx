import React, { useState, useEffect } from 'react';
import { useProductionStore, SpinningEntry } from '../../stores/productionStore';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

type ShiftNumber = 1 | 2 | 3;
type ShiftField = `shift${ShiftNumber}`;
type ShiftOrderField = `shift${ShiftNumber}OrderId`;
type ShiftCountField = `shift${ShiftNumber}Count`;
type ShiftHankField = `shift${ShiftNumber}Hank`;

type ErrorState = {
  [key: string]: {
    [field in keyof SpinningEntry]?: string;
  };
};

interface SpinningEntryTableProps {
  defaultOrderId: string;
  availableOrders: any[];
}

const DEFAULT_MACHINES = 13;

const SpinningEntryTable: React.FC<SpinningEntryTableProps> = ({ defaultOrderId, availableOrders }) => {
  const { spinning, setSpinning } = useProductionStore();
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [errors, setErrors] = useState<ErrorState>({});

  // Helper function to type-safely access shift fields
  const getShiftField = (shift: ShiftNumber): ShiftField => `shift${shift}`;
  const getShiftOrderField = (shift: ShiftNumber): ShiftOrderField => `shift${shift}OrderId`;
  const getShiftCountField = (shift: ShiftNumber): ShiftCountField => `shift${shift}Count`;
  const getShiftHankField = (shift: ShiftNumber): ShiftHankField => `shift${shift}Hank`;
  const getShiftNumber = (value: number): ShiftNumber => {
    if (value >= 1 && value <= 3) {
      return value as ShiftNumber;
    }
    throw new Error(`Invalid shift number: ${value}`);
  };

  // Initialize with 13 machines and default order IDs when component mounts or defaultOrderId changes
  useEffect(() => {
    const selectedOrder = availableOrders.find(order => order.id === defaultOrderId);
    const defaultCount = selectedOrder?.count || '';
    const defaultHank = selectedOrder?.hank || '';

    const initialSpinning = Array(DEFAULT_MACHINES).fill(null).map((_, index) => ({
      machine: `${index + 1}`,
      shift1: 0,
      shift2: 0,
      shift3: 0,
      shift1OrderId: defaultOrderId,
      shift2OrderId: defaultOrderId,
      shift3OrderId: defaultOrderId,
      shift1Count: defaultCount,
      shift2Count: defaultCount,
      shift3Count: defaultCount,
      shift1Hank: defaultHank,
      shift2Hank: defaultHank,
      shift3Hank: defaultHank
    }));
    setSpinning(initialSpinning);
  }, [defaultOrderId, availableOrders]);

  // Update counts and hanks when availableOrders changes
  useEffect(() => {
    if (availableOrders.length > 0) {
      const updatedSpinning = spinning.map(row => {
        const updatedRow = { ...row };
        [1, 2, 3].forEach(shift => {
          const orderIdField = getShiftOrderField(getShiftNumber(shift));
          const countField = getShiftCountField(getShiftNumber(shift));
          const hankField = getShiftHankField(getShiftNumber(shift));
          const orderId = row[orderIdField];
          const selectedOrder = availableOrders.find(order => order.id === orderId);
          if (selectedOrder?.count) {
            updatedRow[countField] = selectedOrder.count;
          }
          if (selectedOrder?.hank) {
            updatedRow[hankField] = selectedOrder.hank;
          }
        });
        return updatedRow;
      });
      setSpinning(updatedSpinning);
    }
  }, [availableOrders]);

  const handleChange = (idx: number, field: keyof SpinningEntry, value: string | number) => {
    const updated = spinning.map((row, i) => {
      if (i === idx) {
        const updatedRow = { ...row, [field]: value };
        
        // If setting a shift value, also set the order ID if not already set
        if (field.startsWith('shift') && !field.endsWith('OrderId') && !field.endsWith('Count') && !field.endsWith('Hank') && typeof value === 'number' && value > 0) {
          const shiftNum = getShiftNumber(parseInt(field.charAt(5)));
          const orderIdField = getShiftOrderField(shiftNum);
          if (!updatedRow[orderIdField]) {
            updatedRow[orderIdField] = defaultOrderId;
          }
        }
        
        // If changing the order ID, update the count and hank from the selected order
        if (field.endsWith('OrderId') && typeof value === 'string') {
          const selectedOrder = availableOrders.find(order => order.id === value);
          if (selectedOrder) {
            const shiftNum = getShiftNumber(parseInt(field.charAt(5)));
            const countField = getShiftCountField(shiftNum);
            const hankField = getShiftHankField(shiftNum);
            if (selectedOrder.count) {
              updatedRow[countField] = selectedOrder.count;
            }
            if (selectedOrder.hank) {
              updatedRow[hankField] = selectedOrder.hank;
            }
          }
        }
        
        return updatedRow;
      }
      return row;
    });
    setSpinning(updated);
  };

  const handleBlur = (idx: number, field: keyof SpinningEntry) => {
    const key = `${idx}`;
    setTouched(prev => ({ ...prev, [key]: true }));
    
    const row = spinning[idx];
    const newErrors = { ...errors };
    
    if (!newErrors[key]) {
      newErrors[key] = {};
    }

    // Validate required fields
    if (!row.machine && field === 'machine') {
      newErrors[key].machine = 'Machine number is required';
    } else {
      delete newErrors[key].machine;
    }

    // Validate shift values
    if (field.startsWith('shift')) {
      if (field.endsWith('Count')) {
        if (!row[field]) {
          newErrors[key][field] = 'Count is required';
        } else {
          delete newErrors[key][field];
        }
      } else if (field.endsWith('Hank')) {
        if (!row[field]) {
          newErrors[key][field] = 'Hank is required';
        } else {
          delete newErrors[key][field];
        }
      } else if (!field.endsWith('OrderId')) {
        const value = Number(row[field]);
        if (isNaN(value) || value < 0) {
          newErrors[key][field] = 'Enter a valid quantity';
        } else {
          delete newErrors[key][field];
        }
      }
    }

    setErrors(newErrors);
  };

  const isValid = (idx: number, shift: ShiftNumber) => {
    const row = spinning[idx];
    const shiftField = getShiftField(shift);
    const orderIdField = getShiftOrderField(shift);
    const countField = getShiftCountField(shift);
    const hankField = getShiftHankField(shift);
    const qty = Number(row[shiftField]);
    const so = row[orderIdField];
    const key = `${idx}`;
    return qty > 0 && !!so && !!row[countField] && !!row[hankField] && 
           (!errors[key] || (!errors[key][shiftField] && !errors[key][countField] && !errors[key][hankField]));
  };

  // Calculate total for each row
  const getRowTotal = (idx: number) => {
    const row = spinning[idx];
    return [1, 2, 3].reduce((sum, shift) => {
      const shiftField = getShiftField(getShiftNumber(shift));
      return sum + (Number(row[shiftField]) || 0);
    }, 0);
  };

  // Get selected order details
  const getSelectedOrder = () => {
    return availableOrders.find(order => order.id === defaultOrderId);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Spinning Machines</h3>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            Default Count: {getSelectedOrder()?.count || 'Not set'}
          </span>
          <span className="text-sm text-gray-600">
            SO: {getSelectedOrder()?.order_number || 'Not selected'}
          </span>
        </div>
      </div>

      {spinning.map((row, idx) => (
        <div key={idx} className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex space-x-4">
              <div>
                <label htmlFor={`machine-${idx}`} className="block text-xs text-gray-500 mb-1">
                  Machine
                </label>
                <input
                  id={`machine-${idx}`}
                  className={`w-24 px-3 py-2 border rounded text-center font-semibold
                    focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition-all
                    ${errors[idx]?.machine ? 'border-red-500' : 'border-gray-300'}`}
                  value={row.machine}
                  onChange={e => handleChange(idx, 'machine', e.target.value)}
                  onBlur={() => handleBlur(idx, 'machine')}
                  placeholder="No."
                  readOnly
                />
                {errors[idx]?.machine && touched[`${idx}`] && (
                  <span className="text-xs text-red-500 mt-1">{errors[idx].machine}</span>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {[1, 2, 3].map((shift) => {
              const shiftNum = getShiftNumber(shift);
              const shiftField = getShiftField(shiftNum);
              const orderIdField = getShiftOrderField(shiftNum);
              const countField = getShiftCountField(shiftNum);
              const hankField = getShiftHankField(shiftNum);
              return (
                <div
                  key={shift}
                  className={`relative flex flex-col rounded-xl p-4 shadow-sm border transition-all duration-150 
                    ${touched[`${idx}-${shift}`] ? 'border-blue-400 shadow-md' : 'border-gray-200'} 
                    ${isValid(idx, shiftNum) ? 'border-green-500' : ''} 
                    bg-white`}
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <span className="font-semibold text-gray-700 text-sm">Shift {shift}</span>
                    {isValid(idx, shiftNum) && (
                      <CheckCircleIcon className="w-5 h-5 text-green-500" aria-label="Valid" />
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div>
                      <label htmlFor={`row${idx}-shift${shift}-count`} className="text-xs text-gray-500 mb-1">
                        Count
                      </label>
                      <input
                        id={`row${idx}-shift${shift}-count`}
                        className={`w-full px-3 py-2 border rounded text-center font-semibold
                          focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition-all
                          ${errors[idx]?.[countField] ? 'border-red-500' : 'border-gray-300'}`}
                        value={row[countField] || ''}
                        onChange={e => handleChange(idx, countField, e.target.value)}
                        onBlur={() => handleBlur(idx, countField)}
                        placeholder="Count"
                      />
                      {errors[idx]?.[countField] && touched[`${idx}-${shift}`] && (
                        <span className="text-xs text-red-500 mt-1">{errors[idx][countField]}</span>
                      )}
                    </div>
                    <div>
                      <label htmlFor={`row${idx}-shift${shift}-hank`} className="text-xs text-gray-500 mb-1">
                        Hank
                      </label>
                      <input
                        id={`row${idx}-shift${shift}-hank`}
                        className={`w-full px-3 py-2 border rounded text-center font-semibold
                          focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition-all
                          ${errors[idx]?.[hankField] ? 'border-red-500' : 'border-gray-300'}`}
                        value={row[hankField] || ''}
                        onChange={e => handleChange(idx, hankField, e.target.value)}
                        onBlur={() => handleBlur(idx, hankField)}
                        placeholder="Hank"
                      />
                      {errors[idx]?.[hankField] && touched[`${idx}-${shift}`] && (
                        <span className="text-xs text-red-500 mt-1">{errors[idx][hankField]}</span>
                      )}
                    </div>
                  </div>
                  
                  <label htmlFor={`row${idx}-shift${shift}-qty`} className="text-xs text-gray-500 mb-1">
                    Qty (kgs)
                  </label>
                  <input
                    id={`row${idx}-shift${shift}-qty`}
                    type="number"
                    min="0"
                    className={`w-full px-3 py-2 border rounded text-center text-lg font-semibold 
                      focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition-all
                      ${errors[idx]?.[shiftField] ? 'border-red-500' : 'border-gray-300'}`}
                    value={row[shiftField] || ''}
                    onChange={e => handleChange(idx, shiftField, Number(e.target.value))}
                    onBlur={() => handleBlur(idx, shiftField)}
                    placeholder="0"
                    autoComplete="off"
                  />
                  {errors[idx]?.[shiftField] && touched[`${idx}-${shift}`] && (
                    <span className="text-xs text-red-500 mt-1">{errors[idx][shiftField]}</span>
                  )}
                  
                  <select
                    className="w-full mt-3 border rounded focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition-all"
                    value={row[orderIdField] || ''}
                    onChange={e => handleChange(idx, orderIdField, e.target.value)}
                  >
                    <option value="">Select SO</option>
                    {availableOrders.map(order => (
                      <option key={order.id} value={order.id}>
                        {order.order_number} - {order.count}
                      </option>
                    ))}
                  </select>
                </div>
              );
            })}
          </div>
          <div className="mt-2 text-sm text-gray-600">
            Machine Total: {getRowTotal(idx)} kgs
          </div>
        </div>
      ))}

      <div className="mt-4 font-medium text-gray-800 text-base">
        Total Today: {spinning.reduce((sum, _, idx) => sum + getRowTotal(idx), 0)} kgs
      </div>
    </div>
  );
};

export default SpinningEntryTable; 