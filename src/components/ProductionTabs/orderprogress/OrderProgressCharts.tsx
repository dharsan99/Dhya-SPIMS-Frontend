import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    CartesianGrid,
  } from 'recharts';
  
  interface OrderProgressChartsProps {
    requiredQty: number;
    producedQty: number;
    trendData: {
      date: string;
      production_kg: number;
    }[];
    loading: boolean;
  }
  
  const OrderProgressCharts = ({
    requiredQty,
    producedQty,
    trendData,
    loading,
  }: OrderProgressChartsProps) => {
    if (loading) {
      return <p className="text-sm text-gray-500">Loading charts...</p>;
    }
  
    const barChartData = [
      { name: 'Required', value: requiredQty },
      { name: 'Produced', value: producedQty },
    ];
  
    const formattedTrendData = trendData.map((entry) => ({
      ...entry,
      date: new Date(entry.date).toLocaleDateString('en-GB'),
    }));
  
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-blue-700 font-semibold mb-2">Required vs Produced</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barChartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
  
        {/* Line Chart */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-blue-700 font-semibold mb-2">Daily Production Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={formattedTrendData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <CartesianGrid strokeDasharray="3 3" />
              <Line
                type="monotone"
                dataKey="production_kg"
                stroke="#10B981"
                name="Production (kg)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };
  
  export default OrderProgressCharts;