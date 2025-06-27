import { useState } from 'react';
import Table from './Table';
import Pagination from './Pagination';
import { Order } from '../types/order';
import FiberStockModal from './FiberStockModal';
import RealisationModal from './RealisationModal';
import OrderStatusModal from './OrderStatusModal';

interface PendingOrdersCardProps {
  data: Order[];
}

const PendingOrdersCard = ({ data }: PendingOrdersCardProps) => {
  const [modalData, setModalData] = useState<{
    fibreCode: string;
    requiredQty: string;
    availableQty: string;
    balanceAfter: string;
  } | null>(null);

  const [realModalOrderId, setRealModalOrderId] = useState<string | null>(null);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(3);

  const visibleOrders = data.filter(order => ['pending', 'in_progress'].includes(order.status));
  const pendingOnly = data.filter(order => order.status === 'pending');

  const totalItems = visibleOrders.length;
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedOrders = visibleOrders
    .sort((a, b) => new Date(a.delivery_date).getTime() - new Date(b.delivery_date).getTime())
    .slice(startIndex, endIndex);

  const runningStockMap: Record<string, number> = {};
  visibleOrders.forEach(order => {
    order.shade?.shade_fibres?.forEach((sf: { fibre: { id: string; stock_kg: any } }) => {
      const fibreId = sf.fibre?.id;
      const stock = parseFloat(sf.fibre?.stock_kg ?? 0);
      if (fibreId && !(fibreId in runningStockMap)) {
        runningStockMap[fibreId] = stock;
      }
    });
  });

  const rows = paginatedOrders.map(order => {
    const orderQty = Number(order.quantity_kg);
    const realisation = parseFloat(order.realisation as any);
    const hasReal = !isNaN(realisation);
    const totalQty = hasReal ? orderQty / (realisation / 100) : 0;

    const fibreBreakdown = hasReal ? (
      <div className="flex flex-wrap items-start gap-2">
        {order.shade?.shade_fibres?.map((sf: any) => {
          const percentage = parseFloat(sf.percentage);
          const fibreId = sf.fibre?.id;
          const fibreCode = sf.fibre?.fibre_code ?? 'UNKNOWN';
          const requiredQty = (percentage / 100) * totalQty;
          const availableBefore = runningStockMap[fibreId] ?? 0;
          const availableAfter = availableBefore - requiredQty;
          runningStockMap[fibreId] = availableAfter;

          const usageRatio = requiredQty / (availableBefore || 1);
          const pillColor =
            usageRatio > 1
              ? 'bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-300'
              : usageRatio > 0.8
              ? 'bg-yellow-200 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
              : 'bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-300';

          return (
            <span
              key={fibreId}
              onClick={() =>
                setModalData({
                  fibreCode,
                  requiredQty: requiredQty.toFixed(2),
                  availableQty: availableBefore.toFixed(2),
                  balanceAfter: availableAfter.toFixed(2),
                })
              }
              className={`inline-block px-2 py-1 text-xs font-semibold rounded-full cursor-pointer hover:scale-105 transition ${pillColor}`}
              title={`Available: ${availableBefore.toFixed(2)}kg\nRequired: ${requiredQty.toFixed(2)}kg\nBalance: ${availableAfter.toFixed(2)}kg`}
            >
              {fibreCode}: {requiredQty.toFixed(2)}kg
            </span>
          );
        })}

        {Array.isArray(order.shade?.raw_cotton_composition) && order.shade.raw_cotton_composition.map((rc: any, idx: number) => {
          const requiredQty = (rc.percentage / 100) * totalQty;
          return (
            <span
              key={`raw-cotton-${idx}`}
              className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
              title={`RAW Cotton (${rc.lot_number || 'N/A'}): ${requiredQty.toFixed(2)}kg`}
            >
              RAW COTTON: {requiredQty.toFixed(2)}kg
            </span>
          );
        })}
      </div>
    ) : (
      <span className="text-gray-400 italic">—</span>
    );

    const realCell = (
      <button
        onClick={() => setRealModalOrderId(order.id)}
        className={`text-xs ${
          hasReal
            ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
            : 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
        } px-2 py-1 rounded hover:opacity-80`}
      >
        {hasReal ? `${realisation.toFixed(1)}% (Edit)` : '+ Add'}
      </button>
    );

    return [
      new Date(order.created_at).toLocaleDateString('en-GB'),
      order.order_number,
      order.shade?.shade_code ?? '-',
      order.count ?? '-',
      fibreBreakdown,
      orderQty.toLocaleString(),
      hasReal ? totalQty.toFixed(2) : '—',
      new Date(order.delivery_date).toLocaleDateString('en-GB'),
      <span className="capitalize px-2 py-1 rounded text-xs font-semibold bg-gray-200 dark:bg-gray-700 dark:text-white">
        {order.status.replace('_', ' ')}
      </span>,
      realCell,
    ];
  });

  return (
    <div className="bg-white dark:bg-gray-900 dark:text-gray-200 p-6 rounded-lg shadow mb-8 transition-colors duration-300">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Production Orders</h3>
        <div className="flex gap-4 items-center">
          <button
            onClick={() => setStatusModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2 rounded"
          >
            Update Order Status
          </button>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {totalItems > 0 && `${startIndex + 1}–${Math.min(endIndex, totalItems)} of ${totalItems}`}
          </div>
        </div>
      </div>

      <Table
        headers={[
          'Date',
          'S/O No',
          'Shade Code',
          'Count',
          'Fibre Composition',
          'Order Qty (kg)',
          'Total Qty (kg)',
          'Delivery Date',
          'Status',
          'Realisation (%)',
        ]}
        rows={rows}
      />

      <Pagination
        page={page}
        setPage={setPage}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        total={totalItems}
        options={[3, 5, 10]}
      />

      {modalData && (
        <FiberStockModal
          fibreCode={modalData.fibreCode}
          requiredQty={modalData.requiredQty}
          availableQty={modalData.availableQty}
          balanceAfter={modalData.balanceAfter}
          onClose={() => setModalData(null)}
          fibreId=""
        />
      )}

      {realModalOrderId && (
        <RealisationModal
          order={data.find((d) => d.id === realModalOrderId)!}
          onClose={() => setRealModalOrderId(null)}
        />
      )}

      {statusModalOpen && (
        <OrderStatusModal
          orders={pendingOnly}
          onClose={() => setStatusModalOpen(false)}
        />
      )}
    </div>
  );
};

export default PendingOrdersCard;