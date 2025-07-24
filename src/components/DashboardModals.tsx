import React from 'react';
import { TailwindDialog } from './ui/Dialog';
import ReceiveTransferModal from './ReceiveTransferModal';

// Helper function to render drill-down content
const renderDrillDownContent = (type: 'financial' | 'operational' | 'growth' | 'sustainability', data: any) => {
  switch (type) {
    case 'financial':
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100">Revenue</h4>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                ₹{data?.revenue?.toLocaleString() || '0'}
              </p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <h4 className="font-semibold text-green-900 dark:text-green-100">Profit</h4>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                ₹{data?.profit?.toLocaleString() || '0'}
              </p>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Financial Breakdown</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Operating Expenses:</span>
                <span>₹{data?.expenses?.toLocaleString() || '0'}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax Rate:</span>
                <span>{data?.taxRate || '0'}%</span>
              </div>
              <div className="flex justify-between">
                <span>Net Margin:</span>
                <span>{data?.netMargin || '0'}%</span>
              </div>
            </div>
          </div>
        </div>
      );
    
    case 'operational':
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <h4 className="font-semibold text-green-900 dark:text-green-100">Efficiency</h4>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {data?.efficiency || '0'}%
              </p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100">Quality Score</h4>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {data?.qualityScore || '0'}%
              </p>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Operational Metrics</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Machine Uptime:</span>
                <span>{data?.uptime || '0'}%</span>
              </div>
              <div className="flex justify-between">
                <span>Production Rate:</span>
                <span>{data?.productionRate || '0'} kg/hr</span>
              </div>
              <div className="flex justify-between">
                <span>Defect Rate:</span>
                <span>{data?.defectRate || '0'}%</span>
              </div>
            </div>
          </div>
        </div>
      );
    
    case 'growth':
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
              <h4 className="font-semibold text-purple-900 dark:text-purple-100">Growth Rate</h4>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {data?.growthRate || '0'}%
              </p>
            </div>
            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg">
              <h4 className="font-semibold text-indigo-900 dark:text-indigo-100">Market Share</h4>
              <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                {data?.marketShare || '0'}%
              </p>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Growth Metrics</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>New Customers:</span>
                <span>{data?.newCustomers || '0'}</span>
              </div>
              <div className="flex justify-between">
                <span>Revenue Growth:</span>
                <span>{data?.revenueGrowth || '0'}%</span>
              </div>
              <div className="flex justify-between">
                <span>Market Expansion:</span>
                <span>{data?.marketExpansion || '0'}%</span>
              </div>
            </div>
          </div>
        </div>
      );
    
    case 'sustainability':
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-teal-50 dark:bg-teal-900/20 p-4 rounded-lg">
              <h4 className="font-semibold text-teal-900 dark:text-teal-100">Carbon Footprint</h4>
              <p className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                {data?.carbonFootprint || '0'} kg CO2
              </p>
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg">
              <h4 className="font-semibold text-emerald-900 dark:text-emerald-100">Energy Efficiency</h4>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {data?.energyEfficiency || '0'}%
              </p>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Sustainability Metrics</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Water Usage:</span>
                <span>{data?.waterUsage || '0'} L/ton</span>
              </div>
              <div className="flex justify-between">
                <span>Waste Reduction:</span>
                <span>{data?.wasteReduction || '0'}%</span>
              </div>
              <div className="flex justify-between">
                <span>Renewable Energy:</span>
                <span>{data?.renewableEnergy || '0'}%</span>
              </div>
            </div>
          </div>
        </div>
      );
    
    default:
      return <div>No detailed data available</div>;
  }
};

interface DashboardModalsProps {
  // Drill-down modal props
  drillDownModal: {
    isOpen: boolean;
    title: string;
    data: any;
    type: 'financial' | 'operational' | 'growth' | 'sustainability';
  };
  closeDrillDown: () => void;
  
  // Receive transfer modal props
  isReceiveModalOpen: boolean;
  selectedTransferId: string | null;
  setIsReceiveModalOpen: (isOpen: boolean) => void;
  setSelectedTransferId: (id: string | null) => void;
  receiveTransferMutation: any;
}

const DashboardModals: React.FC<DashboardModalsProps> = ({
  drillDownModal,
  closeDrillDown,
  isReceiveModalOpen,
  selectedTransferId,
  setIsReceiveModalOpen,
  setSelectedTransferId,
  receiveTransferMutation
}) => {
  return (
    <>
      {/* Receive Transfer Modal */}
      {isReceiveModalOpen && selectedTransferId && (
        <ReceiveTransferModal
          isOpen={isReceiveModalOpen}
          onClose={() => {
            setIsReceiveModalOpen(false);
            setSelectedTransferId(null);
          }}
          onSubmit={({ returned_kg, return_date, remarks }) => {
            receiveTransferMutation.mutate({
              id: selectedTransferId,
              received_qty: returned_kg,
              received_date: return_date,
              remarks
            });
          }}
        />
      )}

      {/* Drill-Down Modal */}
      <TailwindDialog
        isOpen={drillDownModal.isOpen}
        onClose={closeDrillDown}
        title={drillDownModal.title}
        maxWidth="max-w-2xl"
      >
        <div className="p-6">
          {renderDrillDownContent(drillDownModal.type, drillDownModal.data)}
        </div>
      </TailwindDialog>
    </>
  );
};

export default DashboardModals; 