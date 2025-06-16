import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProduction } from '../api/production';
import { ProductionRecord } from '../types/production';
import { Order } from '../types/order';
import { getOrderById } from '../api/orders';
import { aggregateSectionProgress } from '../utils/sectionProgress';
import Loader from '../components/Loader';
import ProductionModal from '../components/ProductionModal';
import ProductionSummaryCard from '../components/ProductionSummaryCard';
import ProductionCharts from '../components/ProductionCharts';
import OrderProgressChart from '../components/OrderProgressChart';
import SectionProgressPanel from '../components/SectionProgressPanel';

const hardcodedOrderId = '41aa32f5-0bcd-4bea-8137-2e10e946b57f';

const ProductionPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduction, setEditingProduction] = useState<ProductionRecord | null>(null);

  const {
    data: productions = [],
    isLoading,
    refetch,
  } = useQuery<ProductionRecord[]>({
    queryKey: ['productions'],
    queryFn: getProduction,
  });

  const {
    data: order,
  } = useQuery<Order>({
    queryKey: ['order', hardcodedOrderId],
    queryFn: () => getOrderById(hardcodedOrderId),
  });

  useEffect(() => {
    document.title = 'Production Records';
  }, []);

  const handleCreate = () => {
    setEditingProduction(null);
    setModalOpen(true);
  };

  const handleEdit = (production: ProductionRecord) => {
    setEditingProduction(production);
    setModalOpen(true);
  };

  const sectionProgress = aggregateSectionProgress(productions, hardcodedOrderId);

  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">📦 Production Dashboard</h2>
        <button
          onClick={handleCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
        >
          ➕ Add Production
        </button>
      </div>

      {order && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <OrderProgressChart orderId={hardcodedOrderId} />
          <SectionProgressPanel 
            order={order}
            sectionProgress={sectionProgress}
            onStatusChange={refetch}
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProductionSummaryCard />
        <ProductionCharts />
      </div>

      <div className="bg-white rounded shadow overflow-x-auto">
        {isLoading ? (
          <Loader />
        ) : (
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Machine</th>
                <th className="p-3 text-left">Section</th>
                <th className="p-3 text-left">Shift</th>
                <th className="p-3 text-right">Production (kg)</th>
                <th className="p-3 text-right">Required (kg)</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {productions.map((prod) => (
                <tr key={prod.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{new Date(prod.date).toLocaleDateString('en-GB')}</td>
                  <td className="p-3">{prod.machine}</td>
                  <td className="p-3">{prod.section}</td>
                  <td className="p-3">{prod.shift}</td>
                  <td className="p-3 text-right">{Number(prod.production_kg).toFixed(2)}</td>
                  <td className="p-3 text-right">{Number(prod.required_qty).toFixed(2)}</td>
                  <td className="p-3 text-center">
                    <span className="text-sm font-medium text-blue-600 capitalize">
                      {prod.status}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleEdit(prod)}
                      className="text-yellow-600 hover:underline text-xs"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
              {productions.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-4 text-center text-gray-400">
                    No production entries found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <ProductionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialData={editingProduction || undefined}
        onSaved={refetch}
      />
    </div>
  );
};

export default ProductionPage;
