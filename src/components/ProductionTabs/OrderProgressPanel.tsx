import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import OrderSelectPanel from './orderprogress/OrderSelectPanel';
import ProgressKPI from './orderprogress/ProgressKPI';
import OrderProgressCharts from './orderprogress/OrderProgressCharts';
import ProgressTimeline from './orderprogress/ProgressTimeline';
import FiberSummary from './orderprogress/FiberSummary';
import EfficiencyInsights from './orderprogress/EfficiencyInsights';
import ExportButtons from './orderprogress/ExportButtons';

import { getAllOrders, getOrderProgressDetails } from '../../api/orders';
import { Order } from '../../types/order';

const OrderProgressPanel = () => {
  const [selectedOrderId, setSelectedOrderId] = useState<string>('');

  const {
    data: orders = [],
    isLoading: loadingOrders,
    isError: ordersError,
  } = useQuery<Order[]>({
    queryKey: ['orders'],
    queryFn: () => getAllOrders({}),
  });

  const {
    data: progressDetails,
    isLoading: loadingProgress,
    isError: progressError,
  } = useQuery({
    queryKey: ['orderProgressDetails', selectedOrderId],
    queryFn: () => getOrderProgressDetails(selectedOrderId),
    enabled: !!selectedOrderId,
  });

  useEffect(() => {
    if (orders.length) {
      setSelectedOrderId(orders[0].id);
    }
  }, [orders]);

  return (
    <div className="space-y-6">
      <OrderSelectPanel
        orders={orders}
        selectedOrderId={selectedOrderId}
        onSelect={setSelectedOrderId}
      />

{selectedOrderId && progressDetails && (
  <>
    <ProgressKPI data={progressDetails.kpis} />

    <OrderProgressCharts
      requiredQty={progressDetails.kpis.requiredQty}
      producedQty={progressDetails.kpis.producedQty}
      trendData={progressDetails.dailyChart}
      loading={loadingProgress}
    />

    <FiberSummary data={progressDetails.fiberSummary} />

    <EfficiencyInsights data={progressDetails.insights} />

    <ProgressTimeline logs={progressDetails.timeline} />

    <ExportButtons
      data={progressDetails.timeline}
      fileName={`order-progress-${selectedOrderId}`}
    />
  </>
)}

      {(loadingOrders || loadingProgress) && (
        <div className="text-center text-sm text-gray-500">Loading...</div>
      )}

      {(ordersError || progressError) && (
        <div className="text-center text-sm text-red-500">Something went wrong.</div>
      )}
    </div>
  );
};

export default OrderProgressPanel;