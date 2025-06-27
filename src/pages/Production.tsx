import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProduction, getOrderProgress } from '../api/production';
import { ProductionRecord } from '../types/production';
import Loader from '../components/Loader';
import ProductionModal from '../components/ProductionModal';
import ProductionSummaryCard from '../components/ProductionSummaryCard';
import React, { Suspense } from 'react';

const hardcodedOrderId = '41aa32f5-0bcd-4bea-8137-2e10e946b57f';

const ProductionCharts = React.lazy(() => import('../components/ProductionCharts'));
const OrderProgressChart = React.lazy(() => import('../components/OrderProgressChart'));

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
    data: progress,
    isLoading: loadingProgress,
  } = useQuery({
    queryKey: ['orderProgress', hardcodedOrderId],
    queryFn: () => getOrderProgress(hardcodedOrderId),
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

  const efficiency = progress
    ? ((progress.producedQty / progress.requiredQty) * 100).toFixed(2)
    : '0';

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Suspense fallback={<Loader />}>
          <OrderProgressChart orderId={hardcodedOrderId} />
        </Suspense>
        <div className="bg-white p-4 shadow rounded">
          <h3 className="text-blue-700 font-semibold mb-2">🎯 Order Completion</h3>
          {loadingProgress ? (
            <Loader />
          ) : (
            <>
              <div className="w-full bg-gray-200 rounded h-4">
                <div
                  className="h-4 bg-green-500 rounded"
                  style={{ width: `${efficiency}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {progress?.producedQty} kg / {progress?.requiredQty} kg (
                <span className="font-medium text-green-600">{efficiency}%</span>)
              </p>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProductionSummaryCard />
        <Suspense fallback={<Loader />}>
          <ProductionCharts />
        </Suspense>
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
