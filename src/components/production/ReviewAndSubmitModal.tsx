import React from 'react';
import { PencilIcon, Cog6ToothIcon, SparklesIcon, BeakerIcon, CubeIcon, AdjustmentsHorizontalIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  data: any;
  onEditSection?: (sectionKey: string) => void;
  orders?: any[];
  onSubmit?: () => void;
}

const ReviewAndSubmitModal: React.FC<Props> = ({ isOpen, onClose, data, onEditSection, orders = [], onSubmit }) => {
  const prevIsOpen = React.useRef(isOpen);

  React.useEffect(() => {
    if (isOpen && !prevIsOpen.current) {
      // No need to set localData as it's not used in the new code
    }
    prevIsOpen.current = isOpen;
  }, [isOpen]);

  // Get SO number from ID (minimal)
  const getSONumber = (orderId: string) => {
    if (!orderId) return '';
    const order = orders.find(o => o.id === orderId);
    return order ? `SO: ${order.order_number}` : `Order not found (${orderId})`;
  };

  // Calculate section totals

  // Calculate section total (sum of all shifts and machines)
  const getSectionTotal = (section: any[]) => {
    const total = section.reduce((sum: number, machine: any) => {
      return sum + (machine.shift1 || 0) + (machine.shift2 || 0) + (machine.shift3 || 0);
    }, 0);
    return total;
  };

  // Helper to get an icon for each section
  const SectionIcon = ({ section }: { section: string }) => {
    switch (section) {
      case 'Blow Room': return <Cog6ToothIcon className="w-5 h-5 text-blue-400" title="Blow Room" />;
      case 'Carding': return <SparklesIcon className="w-5 h-5 text-pink-400" title="Carding" />;
      case 'Drawing': return <BeakerIcon className="w-5 h-5 text-green-400" title="Drawing" />;
      case 'Framing': return <CubeIcon className="w-5 h-5 text-yellow-400" title="Framing" />;
      case 'Simplex': return <AdjustmentsHorizontalIcon className="w-5 h-5 text-purple-400" title="Simplex" />;
      case 'Spinning': return <ArrowPathIcon className="w-5 h-5 text-indigo-400" title="Spinning" />;
      case 'Autoconer': return <Cog6ToothIcon className="w-5 h-5 text-cyan-400" title="Autoconer" />;
      default: return null;
    }
  };

  // Remove unused parameters from renderSection
  const renderSection = (title: string, data: any[]) => {
    const data2 = Array.isArray(data) ? data : [data];
    const sectionTotal = getSectionTotal(data2);
    const shiftTotals = [1, 2, 3].map(shift =>
      data2.reduce((sum: number, row: any) => sum + (row[`shift${shift}`] || 0), 0)
    );

    // Hardcoded machine names for Drawing, Framing, Autoconer
    let machineNames: string[] | undefined = undefined;
    if (title === 'Drawing') machineNames = ['Br1', 'Br2'];
    if (title === 'Framing') machineNames = ['Fr1', 'Fr2'];
    if (title === 'Autoconer') machineNames = ['1 M/C', '2 M/C'];

    return (
      <div className="border-b border-gray-200 py-6 relative">
        <div
          className="sticky z-10 flex items-center justify-between mb-4 bg-white/90 backdrop-blur border-b border-gray-100 px-2 py-2 rounded-t shadow-sm"
          style={{ 
            top: 0,
            position: 'sticky',
            transform: 'translateY(0)',
            transition: 'transform 0.2s ease-out'
          }}
        >
          <h3 className="text-lg font-semibold text-blue-700 tracking-wide flex items-center gap-2">
            <SectionIcon section={title} />
            {title}
          </h3>
          {onEditSection && (
            <button
              onClick={() => onEditSection(title.toLowerCase())}
              className="p-1 rounded hover:bg-blue-50 transition"
              title={`Edit ${title}`}
            >
              <PencilIcon className="w-5 h-5 text-blue-500" />
            </button>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-1">
            <thead>
              <tr className="bg-gray-50 text-xs text-gray-500 uppercase">
                <th className="px-3 py-2 text-left font-medium">Machine</th>
                <th className="px-3 py-2 text-center font-medium">Shift 1</th>
                <th className="px-3 py-2 text-center font-medium">Shift 2</th>
                <th className="px-3 py-2 text-center font-medium">Shift 3</th>
                <th className="px-3 py-2 text-center font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {data2.map((row: any, i: number) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-3 py-2 text-sm font-medium text-gray-700">
                    {machineNames
                      ? machineNames[i] || `Machine ${i + 1}`
                      : (row.machine || `Machine ${i + 1}`)}
                  </td>
                  {[1, 2, 3].map(shift => (
                    <td key={shift} className="px-3 py-2 text-center text-sm">
                      <div className="font-semibold text-gray-900">{row[`shift${shift}`] || 0} kgs</div>
                      <div className="text-xs text-gray-400" title={getSONumber(row[`shift${shift}OrderId`])}>{getSONumber(row[`shift${shift}OrderId`])}</div>
                      {title === 'Spinning' && (
                        <div className="text-xs text-gray-400 mt-1">
                          {row[`shift${shift}Count`] && <span title="Count">Count: {row[`shift${shift}Count`]}</span>}
                          {row[`shift${shift}Hank`] && <span className="ml-2" title="Hank">Hank: {row[`shift${shift}Hank`]}</span>}
                        </div>
                      )}
                    </td>
                  ))}
                  <td className="px-3 py-2 text-center text-blue-700 font-semibold" title="Machine Total">
                    {(row.shift1 || 0) + (row.shift2 || 0) + (row.shift3 || 0)} kgs
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-blue-50 text-xs font-semibold">
                <td className="px-3 py-2 text-right text-blue-700" title="Shift Totals">Shift Totals</td>
                <td className="px-3 py-2 text-center text-blue-700" title="Shift 1 Total">{shiftTotals[0]} kgs</td>
                <td className="px-3 py-2 text-center text-blue-700" title="Shift 2 Total">{shiftTotals[1]} kgs</td>
                <td className="px-3 py-2 text-center text-blue-700" title="Shift 3 Total">{shiftTotals[2]} kgs</td>
                <td className="px-3 py-2 text-center text-blue-900 bg-blue-100 rounded font-bold" title="Section Total">{sectionTotal} kgs</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-[90vw] max-w-6xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Review Production Data</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {renderSection('Blow Room', Array.isArray(data.blowRoom) ? data.blowRoom : [data.blowRoom])}
            {renderSection('Carding', data.carding)}
            {renderSection('Drawing', data.drawing)}
            {renderSection('Framing', data.framing)}
            {renderSection('Simplex', data.simplex)}
            {renderSection('Spinning', data.spinning)}
            {renderSection('Autoconer', data.autoconer)}
          </div>
        </div>

        <div className="p-4 border-t bg-gray-50 flex justify-between items-center">
          <div className="text-lg font-semibold text-gray-900">
            Total Production: {isNaN(Number(data.total)) ? 0 : data.total} kgs
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Close
            </button>
            {onSubmit && (
              <button
                onClick={onSubmit}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Submit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewAndSubmitModal;