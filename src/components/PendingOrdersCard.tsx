import { useState } from 'react';
import Pagination from './Pagination';
import { Order } from '../types/order';
import FiberStockModal from './FiberStockModal';
import RealisationModal from './RealisationModal';
import OrderStatusModal from './OrderStatusModal';
import { useSectionProgress, type SectionProgress } from '../utils/sectionProgress';
import { FiEdit, FiEye, FiPackage } from 'react-icons/fi';
import SectionProgressPanel from './SectionProgressPanel';
import TruncatedText from './ui/TruncatedText';

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
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [showBulkBar] = useState(false);
  const [progressModalOrder, setProgressModalOrder] = useState<Order | null>(null);
  const [progressModalSection, setProgressModalSection] = useState<SectionProgress[] | null>(null);

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

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-0 border border-gray-100 dark:border-gray-800 w-full max-w-3xl mx-auto pb-20">
      <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 mr-2">
            <FiPackage size={20} />
          </span>
          <h3 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">Production Orders</h3>
          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200">
            {visibleOrders.length}
          </span>
        </div>
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
      <div className="overflow-x-auto divide-y divide-gray-100 dark:divide-gray-800">
        {visibleOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center text-gray-400 dark:text-gray-500">
            <img src="/empty-orders.svg" alt="No Orders" className="w-24 h-24 mb-4 opacity-70" onError={e => (e.currentTarget.style.display = 'none')} />
            <span className="text-lg font-semibold">No pending or in-progress orders</span>
            <span className="text-sm mt-1">All caught up!</span>
          </div>
        ) : (
          <table className="min-w-full text-sm border-separate border-spacing-y-1">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800">
                <th scope="col" className="px-5 py-4 text-left align-middle">Order #</th>
                <th scope="col" className="px-5 py-4 text-left align-middle hidden sm:table-cell">Buyer</th>
                <th scope="col" className="px-5 py-4 text-left align-middle">Shade</th>
                <th scope="col" className="px-5 py-4 text-left align-middle hidden md:table-cell">Fibres</th>
                <th scope="col" className="px-5 py-4 text-center align-middle">Order/Total</th>
                <th scope="col" className="px-5 py-4 text-right align-middle">Produced</th>
                <th scope="col" className="px-5 py-4 text-center align-middle hidden md:table-cell">Delivery</th>
                <th scope="col" className="px-5 py-4 text-center align-middle">Realisation</th>
                <th scope="col" className="px-5 py-4 text-center align-middle">Status</th>
                <th scope="col" className="px-5 py-4 text-center align-middle">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.map(order => {
                const orderQty = Number(order.quantity_kg);
                const realisation = parseFloat(order.realisation as any);
                const hasReal = !isNaN(realisation);
                const totalQty = hasReal ? orderQty / (realisation / 100) : 0;
                const runningStockMap: Record<string, number> = {};
                order.shade?.shade_fibres?.forEach((sf: { fibre: { id: string; stock_kg: any } }) => {
                  const fibreId = sf.fibre?.id;
                  const stock = parseFloat(sf.fibre?.stock_kg ?? 0);
                  if (fibreId && !(fibreId in runningStockMap)) {
                    runningStockMap[fibreId] = stock;
                  }
                });
                const fibreBreakdown = hasReal ? (
                  <div className="flex flex-wrap items-center gap-2 min-w-[120px]">
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
                    {Array.isArray(order.shade?.raw_cotton_compositions) && order.shade.raw_cotton_compositions.map((rc: any, idx: number) => {
                      const percentage = parseFloat(rc.percentage);
                      const requiredQty = (percentage / 100) * totalQty;
                      const available = parseFloat(rc.stock_kg ?? '0');
                      const shortage = available < requiredQty;
                      const pillColor = shortage
                        ? 'bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-300'
                        : 'bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-300';
                      const lot = rc.lot_number ? `Lot: ${rc.lot_number}` : '';
                      const grade = rc.grade ? `, Grade: ${rc.grade}` : '';
                      const source = rc.source ? `, Source: ${rc.source}` : '';
                      return (
                        <span
                          key={`raw-cotton-${idx}`}
                          className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${pillColor}`}
                          title={`RAW Cotton ${lot}${grade}${source}\nAvailable: ${available.toFixed(2)}kg\nRequired: ${requiredQty.toFixed(2)}kg`}
                        >
                          RAW COTTON{rc.lot_number ? ` (${rc.lot_number})` : ''}: {requiredQty.toFixed(2)}kg
                        </span>
                      );
                    })}
                    {(!order.shade?.shade_fibres?.length && !order.shade?.raw_cotton_compositions?.length) && (
                      <span className="text-gray-400 italic">—</span>
                    )}
                  </div>
                ) : (
                  <span className="text-gray-400 italic">—</span>
                );
                return (
                  <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition align-middle border-b border-gray-100 dark:border-gray-800 last:border-b-0">
                    <td className="px-5 py-4 font-semibold text-blue-700 dark:text-blue-300 hover:underline cursor-pointer whitespace-nowrap align-middle" onClick={() => setRealModalOrderId(order.id)}>{order.order_number}</td>
                    <td className="px-5 py-4 hidden sm:table-cell whitespace-nowrap align-middle">
                      <TruncatedText text={order.buyer?.name || ''} maxLength={6} />
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap align-middle">{order.shade?.shade_code ?? '-'}</td>
                    <td className="px-5 py-4 hidden md:table-cell align-middle">{fibreBreakdown}</td>
                    <td className="px-5 py-4 text-center whitespace-nowrap align-middle">{orderQty} / {hasReal ? totalQty.toFixed(2) : '—'} kg</td>
                    <td className="px-5 py-4 text-right whitespace-nowrap align-middle"><ProducedQtyBreakdown order={order} onOpenModal={(order, sectionProgress) => { setProgressModalOrder(order); setProgressModalSection(sectionProgress); }} /></td>
                    <td className="px-5 py-4 text-center hidden md:table-cell whitespace-nowrap align-middle">
                      {new Date(order.delivery_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {(() => {
                          const days = Math.ceil((new Date(order.delivery_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                          return days > 0 ? `${days} days left` : days < 0 ? `${Math.abs(days)} days overdue` : 'Due today';
                        })()}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-center whitespace-nowrap align-middle">
                      <button
                        onClick={() => setRealModalOrderId(order.id)}
                        className={`text-xs font-semibold px-2 py-1 rounded transition-all ${hasReal ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800' : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800'} w-full`}
                        title={hasReal ? 'Edit Realisation' : 'Add Realisation'}
                      >
                        {hasReal ? `${realisation.toFixed(1)}% (Edit)` : '+ Add Realisation'}
                      </button>
                    </td>
                    <td className="px-5 py-4 text-center whitespace-nowrap align-middle">
                      <span className={`px-2 py-1 rounded text-xs font-semibold capitalize ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-700/20 dark:text-yellow-300' : order.status === 'in_progress' ? 'bg-blue-100 text-blue-700 dark:bg-blue-700/20 dark:text-blue-300' : order.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-700/20 dark:text-green-300' : 'bg-gray-200 text-gray-700 dark:bg-gray-600/30 dark:text-gray-300'}`}>{order.status.replace('_', ' ')}</span>
                    </td>
                    <td className="px-5 py-4 text-center whitespace-nowrap align-middle">
                      <div className="flex items-center gap-1 justify-center">
                        <Tooltip text="Edit">
                          <button title="Edit" className="p-1 rounded hover:bg-yellow-100 dark:hover:bg-yellow-700/30 focus:outline-none focus:ring-2 focus:ring-yellow-400" onClick={() => {/* edit logic here */}}>
                            <FiEdit size={18} />
                          </button>
                        </Tooltip>
                        <Tooltip text="View">
                          <button title="View" className="p-1 rounded hover:bg-blue-100 dark:hover:bg-blue-700/30 focus:outline-none focus:ring-2 focus:ring-blue-400" onClick={() => setRealModalOrderId(order.id)}>
                            <FiEye size={18} />
                          </button>
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      {visibleOrders.length > rowsPerPage && (
        <div className="px-6 py-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 rounded-b-xl">
          <Pagination
            page={page}
            setPage={setPage}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
            total={visibleOrders.length}
            options={[3, 5, 10]}
          />
        </div>
      )}
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
      {showBulkBar && (
        <div className="fixed bottom-0 left-0 w-full bg-blue-100 dark:bg-blue-900 p-4 flex items-center gap-4 z-50">
          <span>{selectedRows.size} selected</span>
          <button disabled>Bulk Update (TODO)</button>
          <button disabled>Delete (TODO)</button>
          <button onClick={() => setSelectedRows(new Set())}>Clear</button>
        </div>
      )}
      {progressModalOrder && progressModalSection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg max-w-lg w-full p-4 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 dark:hover:text-white text-xl"
              onClick={() => { setProgressModalOrder(null); setProgressModalSection(null); }}
              aria-label="Close"
            >
              ×
            </button>
            <SectionProgressPanel order={progressModalOrder} sectionProgress={progressModalSection} />
          </div>
        </div>
      )}
    </div>
  );
};

function ProducedQtyBreakdown({ 
  order, 
  onOpenModal 
}: { 
  order: Order;
  onOpenModal: (order: Order, sectionProgress: SectionProgress[]) => void;
}) {
  const { sectionProgress, totalProduced, isLoading } = useSectionProgress(order.id);
  
  if (isLoading) return <span className="text-gray-400">Loading...</span>;
  
  const sectionBreakdown = sectionProgress.map((sp: SectionProgress) => `${sp.section}: ${sp.produced}kg`).join(' | ');
  
  return (
    <div 
      className="flex flex-col items-end cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded transition-colors"
      onClick={() => onOpenModal(order, sectionProgress)}
      title="Click to view detailed section progress"
    >
      <span className="font-semibold text-base text-blue-700 dark:text-blue-300">{totalProduced.toFixed(2)} kg</span>
      <span className="text-xs text-gray-500 dark:text-gray-400 mt-1" title={sectionBreakdown}>
        {totalProduced.toFixed(2)} kg
      </span>
    </div>
  );
}

// Tooltip fallback if not present
const Tooltip: React.FC<{ text: string; children: React.ReactNode }> = ({ text, children }) => (
  <span className="relative group">
    {children}
    <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded px-2 py-1 z-10 whitespace-nowrap pointer-events-none">
      {text}
    </span>
  </span>
);

export default PendingOrdersCard;