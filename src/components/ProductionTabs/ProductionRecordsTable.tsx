import { useQuery } from '@tanstack/react-query';
import { getProduction } from '../../api/production';
import { ProductionRecord } from '../../types/production';
import Loader from '../Loader';

const ProductionRecordsTable = () => {
  const { data: records = [], isLoading } = useQuery<ProductionRecord[]>({
    queryKey: ['productions'],
    queryFn: getProduction,
  });

  if (isLoading) return <Loader />;

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-lg font-semibold text-blue-700 mb-4">📋 All Production Records</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Date</th>
              <th className="p-2">Machine</th>
              <th className="p-2">Section</th>
              <th className="p-2">Production (kg)</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="p-2">{new Date(r.date).toLocaleDateString('en-GB')}</td>
                <td className="p-2">{r.machine}</td>
                <td className="p-2">{r.section}</td>
                <td className="p-2">{r.production_kg}</td>
                <td className="p-2">{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductionRecordsTable;