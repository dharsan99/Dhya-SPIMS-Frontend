import React from 'react';

interface BuyerSummary {
  buyer_id: string;
  buyer_name: string;
  total_order_qty: number;
}

interface SupplierSummary {
  supplier: string;
  total: number;
}

interface InventorySummaryModalProps {
  open: boolean;
  onClose: () => void;
  data: {
    lowStockItems: number;
    pendingFiberShortages: number;
    topBuyers: BuyerSummary[];
    topSuppliers: SupplierSummary[];
  };
}

const InventorySummaryModal: React.FC<InventorySummaryModalProps> = ({ open, onClose, data }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 backdrop-blur-sm bg-white/10 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Inventory & Supply Chain Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-2xl font-bold px-2" aria-label="Close">&times;</button>
        </div>
        <div className="text-gray-700 dark:text-gray-200 mb-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-yellow-50 p-3 rounded-lg">
                <div className="text-sm text-yellow-700">Low Stock Items</div>
                <div className="text-xl font-semibold">{data.lowStockItems}</div>
              </div>
              <div className="bg-red-50 p-3 rounded-lg">
                <div className="text-sm text-red-700">Pending Fiber Shortages</div>
                <div className="text-xl font-semibold">{data.pendingFiberShortages}</div>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Top Buyers</h3>
              <div className="space-y-2">
                {data.topBuyers.map((buyer) => (
                  <div key={buyer.buyer_id} className="flex justify-between items-center">
                    <span className="text-blue-700 hover:underline cursor-pointer">{buyer.buyer_name}</span>
                    <span className="font-semibold">{buyer.total_order_qty} kg</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Top Suppliers</h3>
              <div className="space-y-2">
                {data.topSuppliers.map((supplier) => (
                  <div key={supplier.supplier} className="flex justify-between items-center">
                    <span className="text-blue-700 hover:underline cursor-pointer">{supplier.supplier}</span>
                    <span className="font-semibold">₹{supplier.total}</span>
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

export default InventorySummaryModal; 