import { create } from 'zustand';
import { createProduction, ProductionData } from '../api/production';
import { Order } from '../types/order';
import { persist } from 'zustand/middleware';

export interface MachineShiftEntry {
  shift1: number;
  shift2: number;
  shift3: number;
  shift1OrderId?: string;
  shift2OrderId?: string;
  shift3OrderId?: string;
}

export interface SpinningEntry {
  machine: string;
  shift1: number;
  shift2: number;
  shift3: number;
  shift1OrderId?: string;
  shift2OrderId?: string;
  shift3OrderId?: string;
  shift1Count: string;
  shift2Count: string;
  shift3Count: string;
  shift1Hank: string;
  shift2Hank: string;
  shift3Hank: string;
}

export interface AutoconerEntry {
  shift1: number;
  shift2: number;
  shift3: number;
  shift1OrderId: string;
  shift2OrderId: string;
  shift3OrderId: string;
}

interface ProductionSection {
  values: Record<string, any>;
  isSaved: boolean;
}

interface ProductionStore {
  date: string;
  selectedOrders: Order[];
  blowRoom: MachineShiftEntry;
  carding: MachineShiftEntry[];
  drawing: MachineShiftEntry[];
  framing: MachineShiftEntry[];
  simplex: MachineShiftEntry[];
  spinning: SpinningEntry[];
  autoconer: AutoconerEntry[];
  total: number;
  sections: {
    blowRoom: ProductionSection;
    carding: ProductionSection;
    drawing: ProductionSection;
    framing: ProductionSection;
    simplex: ProductionSection;
    spinning: ProductionSection;
    autoconer: ProductionSection;
  };

  setDate: (date: string) => void;
  setSelectedOrders: (orders: Order[]) => void;
  setBlowRoom: (data: MachineShiftEntry) => void;
  setCarding: (data: MachineShiftEntry[]) => void;
  setDrawing: (data: MachineShiftEntry[]) => void;
  setFraming: (data: MachineShiftEntry[]) => void;
  setSimplex: (data: MachineShiftEntry[]) => void;
  setSpinning: (data: SpinningEntry[]) => void;
  setAutoconer: (data: AutoconerEntry[]) => void;
  calculateTotal: () => void;
  submitProduction: () => Promise<void>;
  resetStore: () => void;
  saveSection: (sectionName: keyof ProductionStore['sections'], values: Record<string, any>) => void;
  resetSection: (sectionName: keyof ProductionStore['sections']) => void;
  resetAll: () => void;
  isAllSaved: () => boolean;
}

const getInitialState = () => ({
  date: '',
  selectedOrders: [],
  blowRoom: { shift1: 0, shift2: 0, shift3: 0, shift1OrderId: '', shift2OrderId: '', shift3OrderId: '' },
  carding: Array(8).fill(0).map(() => ({ 
    shift1: 0, shift2: 0, shift3: 0,
    shift1OrderId: '', shift2OrderId: '', shift3OrderId: ''
  })),
  drawing: Array(2).fill(0).map(() => ({ 
    shift1: 0, shift2: 0, shift3: 0,
    shift1OrderId: '', shift2OrderId: '', shift3OrderId: ''
  })),
  framing: Array(2).fill(0).map(() => ({ 
    shift1: 0, shift2: 0, shift3: 0,
    shift1OrderId: '', shift2OrderId: '', shift3OrderId: ''
  })),
  simplex: Array(4).fill(0).map(() => ({ 
    shift1: 0, shift2: 0, shift3: 0,
    shift1OrderId: '', shift2OrderId: '', shift3OrderId: ''
  })),
  spinning: [],
  autoconer: Array(2).fill(0).map(() => ({ 
    shift1: 0, shift2: 0, shift3: 0,
    shift1OrderId: '', shift2OrderId: '', shift3OrderId: ''
  })),
  total: 0,
});

const initialSectionState: ProductionSection = {
  values: {},
  isSaved: false,
};

export const useProductionStore = create<ProductionStore>()(
  persist(
    (set, get) => ({
      ...getInitialState(),
      sections: {
        blowRoom: { ...initialSectionState },
        carding: { ...initialSectionState },
        drawing: { ...initialSectionState },
        framing: { ...initialSectionState },
        simplex: { ...initialSectionState },
        spinning: { ...initialSectionState },
        autoconer: { ...initialSectionState },
      },
      setDate: (date) => set({ date }),
      
      setSelectedOrders: (orders) => set({ selectedOrders: orders }),
      
      setBlowRoom: (data) => {
        set({ blowRoom: data });
        get().calculateTotal();
      },
      
      setCarding: (data) => {
        set({ carding: data });
        get().calculateTotal();
      },
      
      setDrawing: (data) => {
        set({ drawing: data });
        get().calculateTotal();
      },
      
      setFraming: (data) => {
        set({ framing: data });
        get().calculateTotal();
      },
      
      setSimplex: (data) => {
        set({ simplex: data });
        get().calculateTotal();
      },
      
      setSpinning: (data) => {
        set({ spinning: data });
        get().calculateTotal();
      },
      
      setAutoconer: (data) => {
        set({ autoconer: data });
        get().calculateTotal();
      },
      
      calculateTotal: () => {
        const state = get();
        let total = 0;
        
        // Sum blowRoom shifts
        total += Number(state.blowRoom.shift1 || 0) + Number(state.blowRoom.shift2 || 0) + Number(state.blowRoom.shift3 || 0);
        
        // Sum section shifts
        [state.carding, state.drawing, state.framing, state.simplex].forEach(section => {
          total += section.reduce((sum, row) => {
            const rowTotal = Number(row.shift1 || 0) + Number(row.shift2 || 0) + Number(row.shift3 || 0);
            return sum + rowTotal;
          }, 0);
        });
        
        // Sum spinning shifts
        total += state.spinning.reduce((sum, row) => sum + Number(row.shift1 || 0) + Number(row.shift2 || 0) + Number(row.shift3 || 0), 0);
        
        // Sum autoconer shifts
        total += state.autoconer.reduce((sum, row) => sum + Number(row?.shift1 || 0) + Number(row?.shift2 || 0) + Number(row?.shift3 || 0), 0);
        
        set({ total: isNaN(total) ? 0 : total });
      },

      resetStore: () => {
        set(getInitialState());
      },
      
      submitProduction: async () => {
        const state = get();
        if (!state.date) {
          alert('Date is required.');
          return;
        }
        if (state.selectedOrders.length === 0) {
          alert('Please select at least one Sales Order.');
          return;
        }

        const validateSection = (section: (MachineShiftEntry | SpinningEntry | AutoconerEntry)[]) => {
          return section.every(row => {
            for (let shift = 1; shift <= 3; shift++) {
              const value = Number(row[`shift${shift}` as keyof typeof row]) || 0;
              const orderId = row[`shift${shift}OrderId` as keyof typeof row];
              if (value > 0 && !orderId) {
                return false;
              }
            }
            return true;
          });
        };

        const validateBlowRoom = (data: MachineShiftEntry) => {
          for (let shift = 1; shift <= 3; shift++) {
            const value = Number(data[`shift${shift}` as keyof MachineShiftEntry]) || 0;
            const orderId = data[`shift${shift}OrderId` as keyof MachineShiftEntry];
            if (value > 0 && !orderId) {
              return false;
            }
          }
          return true;
        };

        if (!validateBlowRoom(state.blowRoom)) {
          alert('Please select SO for all filled shifts in Blow Room.');
          return;
        }

        if (!validateSection(state.carding)) {
          alert('Please select SO for all filled shifts in Carding.');
          return;
        }

        if (!validateSection(state.drawing)) {
          alert('Please select SO for all filled shifts in Drawing.');
          return;
        }

        if (!validateSection(state.framing)) {
          alert('Please select SO for all filled shifts in Framing.');
          return;
        }

        if (!validateSection(state.simplex)) {
          alert('Please select SO for all filled shifts in Simplex.');
          return;
        }

        if (!validateSection(state.spinning)) {
          alert('Please select SO for all filled shifts in Spinning.');
          return;
        }

        if (!validateSection(state.autoconer)) {
          alert('Please select SO for all filled shifts in Autoconer.');
          return;
        }

        try {
          // Map state to ProductionData
          const productionData: ProductionData = {
            date: state.date,
            selectedOrders: state.selectedOrders,
            blowRoom: state.blowRoom,
            carding: state.carding,
            drawing: state.drawing,
            framing: state.framing,
            simplex: state.simplex,
            spinning: state.spinning.map(entry => ({
              machine: entry.machine,
              count: entry.shift1Count,
              hank: entry.shift1Hank,
              shift1: entry.shift1,
              shift2: entry.shift2,
              shift3: entry.shift3,
              shift1OrderId: entry.shift1OrderId,
              shift2OrderId: entry.shift2OrderId,
              shift3OrderId: entry.shift3OrderId
            })),
            autoconer: state.autoconer.map(entry => ({
              shift1: entry.shift1,
              shift2: entry.shift2,
              shift3: entry.shift3,
              value: 0, // Default value, adjust as needed
              shift1OrderId: entry.shift1OrderId,
              shift2OrderId: entry.shift2OrderId,
              shift3OrderId: entry.shift3OrderId
            })),
            total: state.total
          };

          await createProduction(productionData);
          alert('Production submitted successfully!');
          get().resetStore();
        } catch (err: any) {
          alert('Failed to submit production: ' + (err?.message || 'Unknown error'));
        }
      },
      saveSection: (sectionName: keyof ProductionStore['sections'], values: Record<string, any>) => {
        // Validate that all shifts with quantities have SO assignments
        const validateShiftData = (data: any) => {
          for (let shift = 1; shift <= 3; shift++) {
            const qty = Number(data[`shift${shift}`]);
            const soId = data[`shift${shift}OrderId`];
            if (qty > 0 && !soId) {
              throw new Error(`Shift ${shift} has quantity but no Sales Order assigned`);
            }
          }
        };

        try {
          // For single machine sections like Blow Room
          if (sectionName === 'blowRoom') {
            validateShiftData(values);
          } 
          // For multi-machine sections
          else {
            values.forEach((machine: any, idx: number) => {
              try {
                validateShiftData(machine);
              } catch (e: any) {
                throw new Error(`Machine ${idx + 1}: ${e.message}`);
              }
            });
          }

          set(state => ({
            sections: {
              ...state.sections,
              [sectionName]: {
                values,
                isSaved: true
              }
            }
          }));
        } catch (error: any) {
          throw new Error(`Validation failed: ${error.message}`);
        }
      },
      resetSection: (sectionName) => {
        set((state) => ({
          sections: {
            ...state.sections,
            [sectionName]: { ...initialSectionState },
          },
        }));
      },
      resetAll: () => {
        set((state) => ({
          sections: Object.keys(state.sections).reduce(
            (acc, key) => ({
              ...acc,
              [key]: { ...initialSectionState },
            }),
            {} as ProductionStore['sections']
          ),
        }));
      },
      isAllSaved: () => {
        const state = get();
        return Object.values(state.sections).every((section) => section.isSaved);
      },
    }),
    {
      name: 'production-store',
    }
  )
); 