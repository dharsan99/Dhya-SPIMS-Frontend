// src/pages/ProductionDashboard.tsx
import { useState } from 'react';
import DailyProductionView from '../components/ProductionTabs/DailyProductionView';
import SummaryAnalytics from '../components/ProductionTabs/SummaryAnalytics';
import ProductionFormPanel from '../components/ProductionTabs/ProductionFormPanel';
import OrderProgressPanel from '../components/ProductionTabs/OrderProgressPanel';
import AllRecordsPanel from '../components/ProductionTabs/allrecords/AllRecordsPanel';

const tabs = [
  { label: 'Daily View', value: 'daily' },
  { label: 'Summary Analytics', value: 'summary' },
  { label: 'Order Progress', value: 'order' },
  { label: 'All Records', value: 'records' },
  { label: '➕ Add Production', value: 'add' },
];

const ProductionDashboard = () => {
  const [activeTab, setActiveTab] = useState('daily');

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-blue-700 mb-6">Production Dashboard</h2>

      {/* Tab Menu */}
      <div className="flex gap-3 mb-6 border-b pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-4 py-2 rounded-t-md border-b-2 transition-all duration-200 text-sm font-medium
              ${activeTab === tab.value
                ? 'border-blue-600 text-blue-600 bg-white shadow'
                : 'border-transparent text-gray-500 hover:text-blue-600 hover:border-blue-200'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'daily' && <DailyProductionView />}
        {activeTab === 'summary' && <SummaryAnalytics />}
        {activeTab === 'order' && <OrderProgressPanel />}
        {activeTab === 'records' && <AllRecordsPanel />} {/* ✅ replaced with full version */}
        {activeTab === 'add' && <ProductionFormPanel />}
      </div>
    </div>
  );
};

export default ProductionDashboard;