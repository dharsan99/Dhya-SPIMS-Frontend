import React, { useState, useEffect } from 'react';
import { useProductionStore, MachineShiftEntry } from '../../stores/productionStore';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

interface BlowRoomEntryProps {
  defaultOrderId: string;
  availableOrders: any[];
}

const BlowRoomEntry: React.FC<BlowRoomEntryProps> = ({ defaultOrderId, availableOrders }) => {
  const { blowRoom, setBlowRoom } = useProductionStore();
  const data = blowRoom;
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Initialize shift order IDs with defaultOrderId only if all are empty (new entry)
  useEffect(() => {
    if (
      defaultOrderId &&
      !data.shift1OrderId && !data.shift2OrderId && !data.shift3OrderId
    ) {
      setBlowRoom({
        ...data,
        shift1OrderId: defaultOrderId,
        shift2OrderId: defaultOrderId,
        shift3OrderId: defaultOrderId,
      });
    }
  }, [defaultOrderId, data, setBlowRoom]);

  useEffect(() => {
  }, [data]);

  const handleShiftChange = (shift: number, value: number) => {
    setBlowRoom({
      ...data,
      [`shift${shift}`]: value,
      // Set the order ID to defaultOrderId if there's a quantity but no order ID
      [`shift${shift}OrderId`]: value > 0 ? (data[`shift${shift}OrderId` as keyof MachineShiftEntry] || defaultOrderId) : data[`shift${shift}OrderId` as keyof MachineShiftEntry]
    } as MachineShiftEntry);
  };

  const handleOrderChange = (shift: number, orderId: string) => {
    setBlowRoom({
      ...data,
      [`shift${shift}OrderId`]: orderId || undefined
    } as MachineShiftEntry);
  };

  // Calculate total in real time
  const totalQty = [1, 2, 3].reduce((sum, shift) => sum + (Number((data as any)[`shift${shift}`]) || 0), 0);

  const handleBlur = (shift: number) => {
    setTouched((prev) => ({ ...prev, [shift]: true }));
    const value = Number((data as any)[`shift${shift}`]);
    if (touched[shift] && (isNaN(value) || value < 0)) {
      setErrors((prev) => ({ ...prev, [shift]: 'Enter a valid quantity' }));
    } else {
      setErrors((prev) => ({ ...prev, [shift]: '' }));
    }
  };

  const isValid = (shift: number) => {
    const qty = Number((data as any)[`shift${shift}`]);
    const so = (data as any)[`shift${shift}OrderId`];
    return qty > 0 && !!so && !errors[shift];
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex flex-col md:flex-row gap-4 mb-2">
        {[1, 2, 3].map((shift) => {
          const active = touched[shift];
          const currentOrderId = (data as any)[`shift${shift}OrderId`];
          return (
            <div
              key={shift}
              className={`relative flex-1 flex flex-col items-center rounded-xl p-4 shadow-sm border transition-all duration-150 ${active ? 'border-blue-400 shadow-md' : 'border-gray-200'} ${isValid(shift) ? 'border-green-500' : ''} bg-white`}
              tabIndex={0}
              aria-label={`Shift ${shift} entry`}
            >
              <div className="flex items-center justify-between w-full mb-2">
                <span className="font-semibold text-gray-700 text-sm">Shift {shift}</span>
                {isValid(shift) && <CheckCircleIcon className="w-5 h-5 text-green-500" aria-label="Valid" />}
              </div>
              <label htmlFor={`shift${shift}-qty`} className="text-xs text-gray-500 mb-1 w-full text-left">
                Qty (kgs)
              </label>
              <input
                id={`shift${shift}-qty`}
                name={`shift${shift}-qty`}
                type="number"
                min="0"
                aria-label={`Quantity for Shift ${shift}`}
                aria-describedby={`shift${shift}-helper`}
                className={`w-full px-3 py-2 border rounded text-center text-lg font-semibold focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition-all ${errors[shift] ? 'border-red-500' : 'border-gray-300'}`}
                value={(data as any)[`shift${shift}`] ?? 0}
                onChange={e => handleShiftChange(shift, Number(e.target.value))}
                onBlur={() => handleBlur(shift)}
                placeholder="0"
                autoComplete="off"
              />
              {errors[shift] && touched[shift] && (
                <span className="text-xs text-red-500 mt-1 w-full text-left">{errors[shift]}</span>
              )}
              <select
                id={`shift${shift}-so`}
                name={`shift${shift}-so`}
                aria-label={`Sales Order for Shift ${shift}`}
                className="w-full mt-3 border rounded focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition-all"
                value={currentOrderId || ''}
                onChange={e => handleOrderChange(shift, e.target.value)}
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
      <div className="mt-2 font-medium text-gray-800 text-base">
        Total Today: {totalQty} kgs
      </div>
    </div>
  );
};

export default BlowRoomEntry; 