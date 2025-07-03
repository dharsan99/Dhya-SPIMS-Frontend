// src/pages/ProductionDashboard.tsx
import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getProduction, deleteProduction } from '../api/production';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import Loader from '../components/Loader';
import ReviewAndSubmitModal from '../components/production/ReviewAndSubmitModal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { getAllOrders } from '../api/orders';

interface ProductionEntry {
  machine: string;
  shift: string;
  production_kg: number;
  order_id: string;
}

interface ProductionData {
  id: string;
  date: string;
  updated_at: string;
  total?: string;
  blow_room: ProductionEntry[] | Record<string, any>;
  carding: ProductionEntry[];
  drawing: ProductionEntry[];
  framing: ProductionEntry[];
  simplex: ProductionEntry[];
  spinning: ProductionEntry[];
  autoconer: ProductionEntry[];
  creator?: {
    name: string;
    email: string;
  };
}

// Add mapping helpers (copy from ProductionEntryPage or import if available)
function mapBlowRoomFromApi(apiArr: any[]): any {
  const obj = { shift1: 0, shift2: 0, shift3: 0, shift1OrderId: '', shift2OrderId: '', shift3OrderId: '' };
  apiArr?.forEach((row: any) => {
    if (row.shift === 'A') { obj.shift1 = row.productionKg || row.production_kg; obj.shift1OrderId = row.orderId || row.order_id; }
    if (row.shift === 'B') { obj.shift2 = row.productionKg || row.production_kg; obj.shift2OrderId = row.orderId || row.order_id; }
    if (row.shift === 'C') { obj.shift3 = row.productionKg || row.production_kg; obj.shift3OrderId = row.orderId || row.order_id; }
  });
  return obj;
}
function mapSectionFromApi(apiArr: any[]): any[] {
  const byMachine: Record<string, any> = {};
  apiArr?.forEach((row: any) => {
    if (!byMachine[row.machine]) byMachine[row.machine] = { shift1: 0, shift2: 0, shift3: 0, shift1OrderId: '', shift2OrderId: '', shift3OrderId: '' };
    if (row.shift === 'A') { byMachine[row.machine].shift1 = row.productionKg || row.production_kg; byMachine[row.machine].shift1OrderId = row.orderId || row.order_id; }
    if (row.shift === 'B') { byMachine[row.machine].shift2 = row.productionKg || row.production_kg; byMachine[row.machine].shift2OrderId = row.orderId || row.order_id; }
    if (row.shift === 'C') { byMachine[row.machine].shift3 = row.productionKg || row.production_kg; byMachine[row.machine].shift3OrderId = row.orderId || row.order_id; }
  });
  return Object.values(byMachine);
}
function mapSpinningFromApi(apiArr: any[]): any[] {
  const byMachine: Record<string, any> = {};
  apiArr?.forEach((row: any) => {
    if (!byMachine[row.machine]) byMachine[row.machine] = {
      machine: row.machine,
      shift1: 0, shift2: 0, shift3: 0,
      shift1OrderId: '', shift2OrderId: '', shift3OrderId: '',
      shift1Count: '', shift2Count: '', shift3Count: '',
      shift1Hank: '', shift2Hank: '', shift3Hank: ''
    };
    if (row.shift === 'A') {
      byMachine[row.machine].shift1 = row.productionKg || row.production_kg;
      byMachine[row.machine].shift1OrderId = row.orderId || row.order_id;
      byMachine[row.machine].shift1Count = row.count || '';
      byMachine[row.machine].shift1Hank = row.hank || '';
    }
    if (row.shift === 'B') {
      byMachine[row.machine].shift2 = row.productionKg || row.production_kg;
      byMachine[row.machine].shift2OrderId = row.orderId || row.order_id;
      byMachine[row.machine].shift2Count = row.count || '';
      byMachine[row.machine].shift2Hank = row.hank || '';
    }
    if (row.shift === 'C') {
      byMachine[row.machine].shift3 = row.productionKg || row.production_kg;
      byMachine[row.machine].shift3OrderId = row.orderId || row.order_id;
      byMachine[row.machine].shift3Count = row.count || '';
      byMachine[row.machine].shift3Hank = row.hank || '';
    }
  });
  return Object.values(byMachine);
}
function mapAutoconerFromApi(apiArr: any[]): any[] {
  const byMachine: Record<string, any> = {};
  apiArr?.forEach((row: any) => {
    if (!byMachine[row.machine]) byMachine[row.machine] = { shift1: 0, shift2: 0, shift3: 0, shift1OrderId: '', shift2OrderId: '', shift3OrderId: '' };
    if (row.shift === 'A') { byMachine[row.machine].shift1 = row.productionKg || row.production_kg; byMachine[row.machine].shift1OrderId = row.orderId || row.order_id; }
    if (row.shift === 'B') { byMachine[row.machine].shift2 = row.productionKg || row.production_kg; byMachine[row.machine].shift2OrderId = row.orderId || row.order_id; }
    if (row.shift === 'C') { byMachine[row.machine].shift3 = row.productionKg || row.production_kg; byMachine[row.machine].shift3OrderId = row.orderId || row.order_id; }
  });
  return Object.values(byMachine);
}

const ProductionDashboard = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [filterEmpty, setFilterEmpty] = useState(false);
  const [deleteProd, setDeleteProd] = useState<any | null>(null);
  const [reviewProd, setReviewProd] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);

  // Fetch all productions
  const { data: productions = [], isLoading } = useQuery<ProductionData[]>({
    queryKey: ['productions'],
    queryFn: () => getProduction(),
  });

  useEffect(() => {
    getAllOrders().then(setOrders);
  }, []);

  // Filter out empty productions if needed
  const filteredProductions = filterEmpty
    ? productions.filter(prod => 
        getSectionTotal(prod.blow_room) > 0 ||
        getSectionTotal(prod.carding) > 0 ||
        getSectionTotal(prod.drawing) > 0 ||
        getSectionTotal(prod.framing) > 0 ||
        getSectionTotal(prod.simplex) > 0 ||
        getSectionTotal(prod.spinning) > 0 ||
        getSectionTotal(prod.autoconer) > 0
      )
    : productions;

  // Log fetched productions and filtered productions
  useEffect(() => {
    if (!isLoading) {
      console.log('[ProductionDashboard] productions:', productions);
      console.log('[ProductionDashboard] filteredProductions:', filteredProductions);
    }
  }, [isLoading, productions, filteredProductions]);

  // Helper to calculate section total
  const getSectionTotal = (section: any): number => {
    if (Array.isArray(section)) {
      const sum = section.reduce((acc, entry) => {
        // Support both snake_case and camelCase
        const val = Number(entry.production_kg ?? entry.productionKg);
        return acc + (isNaN(val) ? 0 : val);
      }, 0);
      return sum;
    }
    return 0;
  };

  // Log total production
  const totalProduction = filteredProductions.reduce((sum, prod) => {
    const total = Number(prod.total || 0);
    return sum + (isNaN(total) ? 0 : total);
  }, 0);
  useEffect(() => {
    if (!isLoading) {
      console.log('[ProductionDashboard] totalProduction:', totalProduction);
    }
  }, [isLoading, totalProduction]);

  const formatDisplayDate = (dateString: string | null | undefined) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '—';
    return format(date, 'dd MMM yyyy');
  };

  const formatTime = (dateStr: string) => {
    if (!dateStr) return '—';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '—';
    return format(date, 'HH:mm');
  };

  const formatNumber = (value: number) => {
    if (value === null || value === undefined || isNaN(value)) return '—';
    return value.toFixed(2);
  };

  const handleDelete = async () => {
    if (!deleteProd) return;
    setIsDeleting(true);
    try {
      await deleteProduction(deleteProd.id);
      setDeleteProd(null);
      queryClient.invalidateQueries({ queryKey: ['productions'] });
    } catch (err) {
      alert('Failed to delete entry');
    } finally {
      setIsDeleting(false);
    }
  };

  // Helper to render a summary of the production entry
  const renderProdSummary = (prod: any) => (
    <div className="text-sm text-gray-700 space-y-1">
      <div><strong>Date:</strong> {prod.date}</div>
      <div><strong>Total:</strong> {prod.total} kg</div>
      <div><strong>Created By:</strong> {prod.creator?.name || '—'}</div>
      <div><strong>Blow Room:</strong> {prod.blow_room ? prod.blow_room.length : 0} records</div>
      <div><strong>Carding:</strong> {prod.carding ? prod.carding.length : 0} records</div>
      <div><strong>Drawing:</strong> {prod.drawing ? prod.drawing.length : 0} records</div>
      <div><strong>Framing:</strong> {prod.framing ? prod.framing.length : 0} records</div>
      <div><strong>Simplex:</strong> {prod.simplex ? prod.simplex.length : 0} records</div>
      <div><strong>Spinning:</strong> {prod.spinning ? prod.spinning.length : 0} records</div>
      <div><strong>Autoconer:</strong> {prod.autoconer ? prod.autoconer.length : 0} records</div>
    </div>
  );

  // When opening the review modal, map the data before passing to ReviewAndSubmitModal
  const mappedReviewProd = reviewProd && {
    ...reviewProd,
    blowRoom: mapBlowRoomFromApi(reviewProd.blowRoom || reviewProd.blow_room),
    carding: mapSectionFromApi(reviewProd.carding),
    drawing: mapSectionFromApi(reviewProd.drawing),
    framing: mapSectionFromApi(reviewProd.framing),
    simplex: mapSectionFromApi(reviewProd.simplex),
    spinning: mapSpinningFromApi(reviewProd.spinning),
    autoconer: mapAutoconerFromApi(reviewProd.autoconer),
    total: Number(reviewProd.total) || 0,
  };

  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-blue-700">Production Dashboard</h2>
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={filterEmpty}
              onChange={(e) => setFilterEmpty(e.target.checked)}
              className="rounded border-gray-300"
            />
            <span className="text-sm text-gray-600">Hide empty entries</span>
          </label>
          <button
            onClick={() => navigate('/app/production/new')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
          >
            ➕ Add New Production
          </button>
        </div>
      </div>

      {/* Production Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
          <p className="text-gray-500 text-sm">Total Production</p>
          <p className="text-2xl font-semibold">{formatNumber(totalProduction)} kg</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
          <p className="text-gray-500 text-sm">Entries</p>
          <p className="text-2xl font-semibold">{filteredProductions.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-yellow-500">
          <p className="text-gray-500 text-sm">Last Updated</p>
          <p className="text-2xl font-semibold">
            {filteredProductions.length > 0
              ? formatTime(filteredProductions[0].updated_at)
              : '—'}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-purple-500">
          <p className="text-gray-500 text-sm">Latest Entry</p>
          <p className="text-2xl font-semibold">
            {filteredProductions.length > 0
              ? formatDisplayDate(filteredProductions[0].date)
              : '—'}
          </p>
        </div>
      </div>

      {/* Production Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Blow Room
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Carding
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Drawing
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Framing
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Simplex
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Spinning
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Autoconer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created By
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={11} className="px-6 py-4 text-center">
                    <Loader />
                  </td>
                </tr>
              ) : filteredProductions.length === 0 ? (
                <tr>
                  <td colSpan={11} className="px-6 py-4 text-center text-gray-500">
                    No production entries found
                  </td>
                </tr>
              ) : (
                filteredProductions.map((prod) => {
                  // Log section totals and total for each row
                  console.log('[ProductionDashboard] Row:', {
                    id: prod.id,
                    date: prod.date,
                    blowRoom: getSectionTotal((prod as any)['blowRoom'] || prod.blow_room),
                    carding: getSectionTotal(prod.carding),
                    drawing: getSectionTotal(prod.drawing),
                    framing: getSectionTotal(prod.framing),
                    simplex: getSectionTotal(prod.simplex),
                    spinning: getSectionTotal(prod.spinning),
                    autoconer: getSectionTotal(prod.autoconer),
                    total: Number(prod.total || 0),
                  });
                  return (
                    <tr key={prod.id} className="hover:bg-gray-50">
                      <td
                        className="px-6 py-4 whitespace-nowrap text-sm text-blue-700 cursor-pointer underline hover:text-blue-900"
                        onClick={() => {
                          setReviewProd(prod);
                          console.log('[ProductionDashboard] Review clicked:', prod);
                        }}
                      >
                        {formatDisplayDate(prod.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatNumber(getSectionTotal((prod as any)['blowRoom'] || prod.blow_room))}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatNumber(getSectionTotal(prod.carding))}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatNumber(getSectionTotal(prod.drawing))}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatNumber(getSectionTotal(prod.framing))}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatNumber(getSectionTotal(prod.simplex))}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatNumber(getSectionTotal(prod.spinning))}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatNumber(getSectionTotal(prod.autoconer))}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                        {formatNumber(Number(prod.total || 0))}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {prod.creator?.name || '—'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <button
                          className="text-green-600 hover:underline mr-2"
                          onClick={() => {
                            navigate(`/app/production/${prod.date}`);
                            console.log('[ProductionDashboard] Edit clicked:', prod);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="text-red-600 hover:underline"
                          onClick={() => {
                            setDeleteProd(prod);
                            console.log('[ProductionDashboard] Delete clicked:', prod);
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Review Modal */}
      {reviewProd && (
        (() => { console.log('[ProductionDashboard] mappedReviewProd:', mappedReviewProd); return null; })(),
        <ReviewAndSubmitModal isOpen={!!reviewProd} onClose={() => setReviewProd(null)} data={mappedReviewProd} orders={orders} />
      )}
      {/* Delete Confirmation Dialog with review */}
      <ConfirmDialog
        isOpen={!!deleteProd}
        title="Delete Production Entry?"
        description={deleteProd ? (
          <div>
            {renderProdSummary(deleteProd)}
            <div className="mt-4 text-red-600 font-semibold">
              Are you sure you want to delete this entry? This action cannot be undone.
            </div>
          </div>
        ) : ''}
        confirmLabel={isDeleting ? 'Deleting...' : 'Delete'}
        cancelLabel="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setDeleteProd(null)}
      />
    </div>
  );
};

export default ProductionDashboard;