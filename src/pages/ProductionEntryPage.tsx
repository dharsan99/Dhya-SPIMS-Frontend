import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useProductionStore } from '../stores/productionStore';
import BlowRoomEntry from '../components/production/BlowRoomEntry';
import CardingEntry from '../components/production/CardingEntry';
import DrawingEntry from '../components/production/DrawingEntry';
import FramingEntry from '../components/production/FramingEntry';
import SimplexEntry from '../components/production/SimplexEntry';
import SpinningEntryTable from '../components/production/SpinningEntryTable';
import AutoconerEntry from '../components/production/AutoconerEntry';
import ReviewAndSubmitModal from '../components/production/ReviewAndSubmitModal';
import { Order } from '../types/order';
import { getOrdersWithRealisation } from '../api/orders';
import SearchableDropdown from '../components/SearchableDropdown';
import { toast } from 'react-hot-toast';
import { createProduction, getProductionByDate } from '../api/production';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import type { MachineShiftEntry, SpinningEntry, AutoconerEntry as AutoconerEntryType } from '../stores/productionStore';


const sections = [
  { label: 'Blow Room', component: BlowRoomEntry },
  { label: 'Carding', component: CardingEntry },
  { label: 'Drawing', component: DrawingEntry },
  { label: 'Framing', component: FramingEntry },
  { label: 'Simplex', component: SimplexEntry },
  { label: 'Spinning', component: SpinningEntryTable },
  { label: 'Autoconer', component: AutoconerEntry },
];

const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-CA');
};

const sectionLabels = sections.map(s => s.label);

const ProductionEntryPage = () => {
  const { date: urlDate } = useParams();
  const { date, setDate, selectedOrders, setSelectedOrders } = useProductionStore();
  const store = useProductionStore();
  const [showReview, setShowReview] = useState(false);
  const [availableOrders, setAvailableOrders] = useState<Order[]>([]);
  const [touched, setTouched] = useState<{date: boolean, so: boolean}>({date: false, so: false});
  const [currentSection, setCurrentSection] = useState(0);
  const [confirmResetSection, setConfirmResetSection] = useState<number | null>(null);
  const [confirmResetAll, setConfirmResetAll] = useState(false);
  const [isPrefilled, setIsPrefilled] = useState(!urlDate);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const orders = await getOrdersWithRealisation();
        // Filter orders that have realisation
        const ordersWithRealisation = orders.filter(order => order.realisation !== undefined && order.realisation !== null);
        setAvailableOrders(ordersWithRealisation);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      }
    };
    fetchOrders();
  }, []);

  useEffect(() => {
    // Only prefill if editing (urlDate exists)
    const prefillProduction = async () => {
      if (urlDate && availableOrders.length > 0) {
        try {
          let prod = await getProductionByDate(urlDate);
          if (Array.isArray(prod)) prod = prod[0];
          if (prod) {
            setDate(prod.date ? prod.date.slice(0, 10) : '');
            let selectedOrderObjs: any[] = [];
            if (prod.selectedOrders && prod.selectedOrders.length > 0) {
              selectedOrderObjs = availableOrders.filter(order =>
                prod.selectedOrders.includes(order.id) || prod.selectedOrders.includes(order)
              );
              setSelectedOrders(selectedOrderObjs.length > 0 ? selectedOrderObjs : prod.selectedOrders);
            }
            setTimeout(() => {
              if (prod.blow_room) {
                const mapped = mapBlowRoomFromApi(prod.blow_room);
                store.setBlowRoom(mapped);
              }
              if (prod.carding) store.setCarding(mapSectionFromApi(prod.carding) as MachineShiftEntry[]);
              if (prod.drawing) store.setDrawing(mapSectionFromApi(prod.drawing) as MachineShiftEntry[]);
              if (prod.framing) store.setFraming(mapSectionFromApi(prod.framing) as MachineShiftEntry[]);
              if (prod.simplex) store.setSimplex(mapSectionFromApi(prod.simplex) as MachineShiftEntry[]);
              if (prod.spinning) store.setSpinning(mapSpinningFromApi(prod.spinning) as SpinningEntry[]);
              if (prod.autoconer) store.setAutoconer(mapAutoconerFromApi(prod.autoconer) as AutoconerEntryType[]);
              setIsPrefilled(true);
            }, 0);
          }
        } catch (err) {
          console.error('Failed to prefill production entry:', err);
        }
      }
    };
    prefillProduction();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlDate, availableOrders]);

  // --- Mapping helpers ---
  function mapBlowRoomFromApi(apiArr: any[]): MachineShiftEntry {
    const obj: MachineShiftEntry = { shift1: 0, shift2: 0, shift3: 0, shift1OrderId: '', shift2OrderId: '', shift3OrderId: '' };
    apiArr.forEach((row: any) => {
      if (row.shift === 'A') { obj.shift1 = row.production_kg; obj.shift1OrderId = row.order_id; }
      if (row.shift === 'B') { obj.shift2 = row.production_kg; obj.shift2OrderId = row.order_id; }
      if (row.shift === 'C') { obj.shift3 = row.production_kg; obj.shift3OrderId = row.order_id; }
    });
    return obj;
  }
  function mapSectionFromApi(apiArr: any[]): MachineShiftEntry[] {
    const byMachine: Record<string, MachineShiftEntry> = {};
    apiArr.forEach((row: any) => {
      if (!byMachine[row.machine]) byMachine[row.machine] = { shift1: 0, shift2: 0, shift3: 0, shift1OrderId: '', shift2OrderId: '', shift3OrderId: '' };
      if (row.shift === 'A') { byMachine[row.machine].shift1 = row.production_kg; byMachine[row.machine].shift1OrderId = row.order_id; }
      if (row.shift === 'B') { byMachine[row.machine].shift2 = row.production_kg; byMachine[row.machine].shift2OrderId = row.order_id; }
      if (row.shift === 'C') { byMachine[row.machine].shift3 = row.production_kg; byMachine[row.machine].shift3OrderId = row.order_id; }
    });
    return Object.values(byMachine);
  }
  function mapSpinningFromApi(apiArr: any[]): SpinningEntry[] {
    const byMachine: Record<string, SpinningEntry> = {};
    apiArr.forEach((row: any) => {
      if (!byMachine[row.machine]) byMachine[row.machine] = {
        machine: row.machine,
        shift1: 0, shift2: 0, shift3: 0,
        shift1OrderId: '', shift2OrderId: '', shift3OrderId: '',
        shift1Count: '', shift2Count: '', shift3Count: '',
        shift1Hank: '', shift2Hank: '', shift3Hank: ''
      };
      if (row.shift === 'A') {
        byMachine[row.machine].shift1 = row.production_kg;
        byMachine[row.machine].shift1OrderId = row.order_id;
        byMachine[row.machine].shift1Count = row.count || '';
        byMachine[row.machine].shift1Hank = row.hank || '';
      }
      if (row.shift === 'B') {
        byMachine[row.machine].shift2 = row.production_kg;
        byMachine[row.machine].shift2OrderId = row.order_id;
        byMachine[row.machine].shift2Count = row.count || '';
        byMachine[row.machine].shift2Hank = row.hank || '';
      }
      if (row.shift === 'C') {
        byMachine[row.machine].shift3 = row.production_kg;
        byMachine[row.machine].shift3OrderId = row.order_id;
        byMachine[row.machine].shift3Count = row.count || '';
        byMachine[row.machine].shift3Hank = row.hank || '';
      }
    });
    return Object.values(byMachine);
  }
  function mapAutoconerFromApi(apiArr: any[]): AutoconerEntryType[] {
    const byMachine: Record<string, AutoconerEntryType> = {};
    apiArr.forEach((row: any) => {
      if (!byMachine[row.machine]) byMachine[row.machine] = { shift1: 0, shift2: 0, shift3: 0, shift1OrderId: '', shift2OrderId: '', shift3OrderId: '' };
      if (row.shift === 'A') { byMachine[row.machine].shift1 = row.production_kg; byMachine[row.machine].shift1OrderId = row.order_id; }
      if (row.shift === 'B') { byMachine[row.machine].shift2 = row.production_kg; byMachine[row.machine].shift2OrderId = row.order_id; }
      if (row.shift === 'C') { byMachine[row.machine].shift3 = row.production_kg; byMachine[row.machine].shift3OrderId = row.order_id; }
    });
    return Object.values(byMachine);
  }


  const today = formatDate(new Date());
  const maxDate = today;

  const handleSectionSave = (sectionIndex: number) => {
    const sectionName = Object.keys(store.sections)[sectionIndex] as keyof typeof store.sections;
    const sectionData = store[sectionName as keyof typeof store] as any[];
    
    // Validate section data
    if (!sectionData || sectionData.length === 0) {
      toast.error('Please enter at least one value for this section');
      return;
    }

    // Save section data
    store.saveSection(sectionName, sectionData);
    toast.success(`${sections[sectionIndex].label} saved successfully!`);

    // Move to next section if not the last one
    if (sectionIndex < sections.length - 1) {
      setCurrentSection(sectionIndex + 1);
    }
  };

  const handleSectionReset = (sectionIndex: number) => {
    setConfirmResetSection(sectionIndex);
  };

  const confirmSectionReset = () => {
    if (confirmResetSection !== null) {
      const sectionName = Object.keys(store.sections)[confirmResetSection] as keyof typeof store.sections;
      store.resetSection(sectionName);
      toast.success(`${sections[confirmResetSection].label} reset successfully!`);
      setConfirmResetSection(null);
    }
  };


  const confirmAllReset = () => {
    store.resetAll();
    setCurrentSection(0);
    toast.success('All sections reset successfully!');
    setConfirmResetAll(false);
  };

  const handleEditSection = (sectionKey: string) => {
    const sectionIndex = Object.keys(store.sections).indexOf(sectionKey);
    if (sectionIndex !== -1) {
      setShowReview(false);
      setCurrentSection(sectionIndex);
    }
  };

  // Stepper UI
  const Stepper = () => (
    <div className="flex items-center justify-between mb-8">
      {sectionLabels.map((label, idx) => (
        <div key={label} className="flex-1 flex flex-col items-center">
          <button
            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mb-1 transition-colors duration-150
              ${idx === currentSection ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300 bg-white text-gray-500'}
            `}
            onClick={() => {
              if (idx <= currentSection) setCurrentSection(idx);
            }}
            disabled={idx > currentSection}
            aria-label={`Go to ${label}`}
          >
            {idx + 1}
          </button>
          <span className={`text-xs ${idx === currentSection ? 'text-blue-700 font-semibold' : 'text-gray-500'}`}>{label}</span>
          {idx < sectionLabels.length - 1 && (
            <div className="w-full h-1 bg-gray-200 mt-1 mb-1">
              <div className={`h-1 ${idx <= currentSection ? 'bg-blue-500' : 'bg-gray-300'}`} style={{ width: '100%' }} />
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const handleSubmit = async () => {
    // Log the form data before mapping
    console.log('[ProductionEntry] Form data before mapping:', {
      date,
      selectedOrders,
      autoconer: store.autoconer,
      blowRoom: store.blowRoom,
      carding: store.carding,
      drawing: store.drawing,
      framing: store.framing,
      simplex: store.simplex,
      spinning: store.spinning,
      total: store.total,
    });

    // Map spinning to API format
    const mappedSpinning = store.spinning.map(row => ({
      machine: row.machine,
      count: row.shift1Count || row.shift2Count || row.shift3Count || '',
      hank: row.shift1Hank || row.shift2Hank || row.shift3Hank || '',
      shift1: row.shift1,
      shift1OrderId: row.shift1OrderId,
      shift1Count: row.shift1Count,
      shift1Hank: row.shift1Hank,
      shift2: row.shift2,
      shift2OrderId: row.shift2OrderId,
      shift2Count: row.shift2Count,
      shift2Hank: row.shift2Hank,
      shift3: row.shift3,
      shift3OrderId: row.shift3OrderId,
      shift3Count: row.shift3Count,
      shift3Hank: row.shift3Hank,
    }));
    console.log('Mapped spinning for API:', mappedSpinning);

    // Map autoconer to API format
    const mappedAutoconer = store.autoconer.map(row => ({
      ...row,
      value: (row.shift1 || 0) + (row.shift2 || 0) + (row.shift3 || 0),
    }));
    console.log('Mapped autoconer for API:', mappedAutoconer);

    // Construct the payload
    const payload = {
      date,
      selectedOrders,
      autoconer: mappedAutoconer,
      blowRoom: store.blowRoom,
      carding: store.carding,
      drawing: store.drawing,
      framing: store.framing,
      simplex: store.simplex,
      spinning: mappedSpinning,
      total: store.total,
      // ... other fields
    };

    // Log the payload to be sent
    console.log('[ProductionEntry] Payload to be sent:', payload);

    try {
      const response = await createProduction(payload);
      // Log the API response
      console.log('[ProductionEntry] API response:', response);
      // ... existing code ...
    } catch (error) {
      console.error('Error submitting production:', error);
      // ... existing code ...
    }
  };

  // Normalize orders for modal
  const normalizedOrders = availableOrders.map(order => ({
    ...order,
    id: order.id || (order as any)?.order_id,
  }));

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-2xl font-bold text-blue-700 mb-2">Production Entry</h2>
        <p className="text-gray-500 mb-4">Fill in the details below to add a new production entry. Fields marked with <span className='text-red-500'>*</span> are required.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="date"
              value={date ? date.slice(0, 10) : ''}
              onChange={e => { setDate(e.target.value); setTouched(t => ({...t, date: true})); }}
              max={maxDate}
              required
              className={`border rounded px-3 py-2 w-full ${touched.date && !date ? 'border-red-500' : ''}`}
              onBlur={() => setTouched(t => ({...t, date: true}))}
            />
            {touched.date && !date && <span className="text-xs text-red-500">Date is required</span>}
          </div>
          {/* Only show Sales Order dropdown if not in edit mode */}
          {!urlDate && (
            <div>
              <SearchableDropdown
                label="Sales Order"
                name="so"
                options={availableOrders.map(order => ({
                  value: order.id,
                  label: `${order.order_number} - ${order.shade?.shade_name} (${order.realisation}%)`
                }))}
                value={selectedOrders[0]?.id || ''}
                onChange={id => {
                  const selectedOrder = availableOrders.find(o => o.id === id);
                  setSelectedOrders(selectedOrder ? [selectedOrder] : []);
                  setTouched(t => ({...t, so: true}));
                }}
                required
              />
              {touched.so && selectedOrders.length === 0 && <span className="text-xs text-red-500">Sales order is required</span>}
              <p className="text-xs text-gray-400 mt-1">Only orders with realisation are shown.</p>
            </div>
          )}
        </div>
      </div>
      <Stepper />
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          {isPrefilled ? (
            sections.map((Section, index) => (
              <div key={Section.label} className={currentSection === index ? '' : 'hidden'}>
                <Section.component
                  defaultOrderId={selectedOrders[0]?.id || ''}
                  availableOrders={availableOrders}
                />
                <div className="flex justify-between mt-6">
                  <button
                    onClick={() => handleSectionReset(index)}
                    className="px-4 py-2 text-red-600 hover:text-red-700 transition-colors"
                  >
                    Reset Section
                  </button>
                  <div className="space-x-4">
                    {index > 0 && (
                      <button
                        onClick={() => setCurrentSection(index - 1)}
                        className="px-4 py-2 text-gray-600 hover:text-gray-700 transition-colors"
                      >
                        Previous
                      </button>
                    )}
                    <button
                      onClick={() => handleSectionSave(index)}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                      {index === sections.length - 1 ? 'Save & Review' : 'Save & Continue'}
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-400">Loading production data...</div>
          )}
        </div>
      </div>
      <div className="flex justify-end mt-8">
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded text-lg shadow disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
          onClick={() => setShowReview(true)}
          disabled={!date || selectedOrders.length === 0 || !store.isAllSaved()}
        >
          Review & Submit
        </button>
      </div>
      <ReviewAndSubmitModal
        isOpen={showReview}
        onClose={() => setShowReview(false)}
        data={store}
        orders={normalizedOrders}
        onEditSection={handleEditSection}
        {...(!urlDate && { onSubmit: handleSubmit })}
      />
      <ConfirmDialog
        isOpen={confirmResetSection !== null}
        title="Reset Section?"
        description="Are you sure you want to reset this section? This action cannot be undone."
        confirmLabel="Reset"
        cancelLabel="Cancel"
        onConfirm={confirmSectionReset}
        onCancel={() => setConfirmResetSection(null)}
      />
      <ConfirmDialog
        isOpen={confirmResetAll}
        title="Reset All Sections?"
        description="Are you sure you want to reset ALL sections? This will clear all entered data."
        confirmLabel="Reset All"
        cancelLabel="Cancel"
        onConfirm={confirmAllReset}
        onCancel={() => setConfirmResetAll(false)}
      />
    </div>
  );
};

export default ProductionEntryPage; 