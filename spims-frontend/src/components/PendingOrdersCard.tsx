import { useState } from 'react';
import Table from './Table';
import Pagination from './Pagination';
import { Order } from '../types/order';
import FiberStockModal from './FiberStockModal';
import RealisationModal from './RealisationModal';

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
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(3);

  const filtered = data.filter((order) => order.status === 'pending');
  const totalItems = filtered.length;
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedOrders = filtered
    .sort((a, b) => new Date(a.delivery_date).getTime() - new Date(b.delivery_date).getTime())
    .slice(startIndex, endIndex);

  const runningStockMap: Record<string, number> = {};
  filtered.forEach(order => {
    order.shade?.shade_fibres?.forEach((sf: { fibre: { id: any; stock_kg: any; }; }) => {
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

    const fibreBreakdown = hasReal
      ? order.shade?.shade_fibres.map((sf: { percentage: string; fibre: { id: any; fibre_code: string; }; }) => {
          const percentage = parseFloat(sf.percentage);
          const fibreId = sf.fibre?.id;
          const fibreCode = sf.fibre?.fibre_code ?? 'UNKNOWN';
          const requiredQty = (percentage / 100) * totalQty;
          const availableBefore = runningStockMap[fibreId] ?? 0;
          const availableAfter = availableBefore - requiredQty;
          runningStockMap[fibreId] = availableAfter;

          const usageRatio = requiredQty / availableBefore;
          const pillColor =
            usageRatio > 1
              ? 'bg-red-100 text-red-800'
              : usageRatio > 0.8
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-green-100 text-green-700';

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
              className={`inline-block px-2 py-1 text-xs font-medium rounded-full mr-2 mb-1 cursor-pointer ${pillColor}`}
            >
              {fibreCode}: {requiredQty.toFixed(2)}kg
            </span>
          );
        })
      : null;

    const realCell = hasReal ? (
      <span className="text-green-700 font-medium">{realisation.toFixed(1)}%</span>
    ) : (
      <button
        onClick={() => setRealModalOrderId(order.id)}
        className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded hover:bg-blue-200"
      >
        ➕ Add
      </button>
    );

    return [
      new Date(order.created_at).toLocaleDateString('en-GB'),
      order.order_number,
      order.shade?.shade_code ?? '-',
      hasReal ? <div className="flex flex-wrap">{fibreBreakdown}</div> : <span className="text-gray-400 italic">—</span>,
      orderQty.toLocaleString(),
      hasReal ? totalQty.toFixed(2) : '—',
      new Date(order.delivery_date).toLocaleDateString('en-GB'),
      order.status,
      realCell,
    ];
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Pending Orders</h3>
        <div className="text-sm text-gray-500">
          {totalItems > 0 && (
            <>{startIndex + 1}–{Math.min(endIndex, totalItems)} of {totalItems} items</>
          )}
        </div>
      </div>

      <Table
        headers={[
          'Date',
          'S/O No',
          'Shade Code',
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
        />
      )}

      {realModalOrderId && (
        <RealisationModal
          order={data.find((d) => d.id === realModalOrderId)!}
          onClose={() => setRealModalOrderId(null)}
        />
      )}
    </div>
  );
};

export default PendingOrdersCard;
