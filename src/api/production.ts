import api from './axios';
import { Order } from '../types/order';

const endpoint = '/api/productions';

export const getProduction = async (params = {}) => {
  const res = await api.get(endpoint, { params });
  return res.data;
};

export const getProductionById = (id: string) => {
  return api.get(`${endpoint}/${id}`).then(res => {
    return res.data;
  });
};

export const getOrderProgress = (orderId: string) => {
  return api.get(`${endpoint}/progress/${orderId}`).then((res) => {
    return res.data;
  });
};

export interface ProductionData {
  date: string;
  selectedOrders: Order[];
  blowRoom: {
    shift1: number;
    shift2: number;
    shift3: number;
    shift1OrderId?: string;
    shift2OrderId?: string;
    shift3OrderId?: string;
  };
  carding: Array<{
    shift1: number;
    shift2: number;
    shift3: number;
    shift1OrderId?: string;
    shift2OrderId?: string;
    shift3OrderId?: string;
  }>;
  drawing: Array<{
    shift1: number;
    shift2: number;
    shift3: number;
    shift1OrderId?: string;
    shift2OrderId?: string;
    shift3OrderId?: string;
  }>;
  framing: Array<{
    shift1: number;
    shift2: number;
    shift3: number;
    shift1OrderId?: string;
    shift2OrderId?: string;
    shift3OrderId?: string;
  }>;
  simplex: Array<{
    shift1: number;
    shift2: number;
    shift3: number;
    shift1OrderId?: string;
    shift2OrderId?: string;
    shift3OrderId?: string;
  }>;
  spinning: Array<{
    machine: string;
    count: string;
    hank: string;
    shift1: number;
    shift2: number;
    shift3: number;
    shift1OrderId?: string;
    shift2OrderId?: string;
    shift3OrderId?: string;
  }>;
  autoconer: Array<{
    shift1: number;
    shift2: number;
    shift3: number;
    value: number;
    shift1OrderId?: string;
    shift2OrderId?: string;
    shift3OrderId?: string;
  }>;
  total: number;
}

export const createProduction = async (data: ProductionData) => {
  // Helper to flatten machine sections
  function flattenSection(section: Array<any>, sectionName: string) {
    return section.flatMap((machine: any, idx: number) =>
      [
        { machine: `${sectionName}-${idx + 1}`, shift: 'A', production_kg: machine.shift1, order_id: machine.shift1OrderId },
        { machine: `${sectionName}-${idx + 1}`, shift: 'B', production_kg: machine.shift2, order_id: machine.shift2OrderId },
        { machine: `${sectionName}-${idx + 1}`, shift: 'C', production_kg: machine.shift3, order_id: machine.shift3OrderId }
      ].filter(row => row.production_kg != null && row.production_kg !== 0)
    );
  }

  // Blow room is a single object, not an array
  function flattenBlowRoom(br: any) {
    return [
      { machine: 'BlowRoom', shift: 'A', production_kg: br.shift1, order_id: br.shift1OrderId },
      { machine: 'BlowRoom', shift: 'B', production_kg: br.shift2, order_id: br.shift2OrderId },
      { machine: 'BlowRoom', shift: 'C', production_kg: br.shift3, order_id: br.shift3OrderId }
    ].filter(row => row.production_kg != null && row.production_kg !== 0);
  }

  // Spinning has extra fields
  function flattenSpinning(section: Array<any>) {
    return section.flatMap((machine: any) =>
      [
        { machine: machine.machine, count: machine.count, hank: machine.hank, shift: 'A', production_kg: machine.shift1, order_id: machine.shift1OrderId },
        { machine: machine.machine, count: machine.count, hank: machine.hank, shift: 'B', production_kg: machine.shift2, order_id: machine.shift2OrderId },
        { machine: machine.machine, count: machine.count, hank: machine.hank, shift: 'C', production_kg: machine.shift3, order_id: machine.shift3OrderId }
      ].filter(row => row.production_kg != null && row.production_kg !== 0)
    );
  }

  // Autoconer has extra value field
  function flattenAutoconer(section: Array<any>) {
    return section.flatMap((machine: any, idx: number) =>
      [
        { machine: `Autoconer-${idx + 1}`, shift: 'A', production_kg: machine.shift1, order_id: machine.shift1OrderId, value: machine.value },
        { machine: `Autoconer-${idx + 1}`, shift: 'B', production_kg: machine.shift2, order_id: machine.shift2OrderId, value: machine.value },
        { machine: `Autoconer-${idx + 1}`, shift: 'C', production_kg: machine.shift3, order_id: machine.shift3OrderId, value: machine.value }
      ].filter(row => row.production_kg != null && row.production_kg !== 0)
    );
  }

  const transformedData = {
    date: data.date,
    selected_orders: data.selectedOrders.map(order => order.id),
    blow_room: flattenBlowRoom(data.blowRoom),
    carding: flattenSection(data.carding, 'Carding'),
    drawing: flattenSection(data.drawing, 'Drawing'),
    framing: flattenSection(data.framing, 'Framing'),
    simplex: flattenSection(data.simplex, 'Simplex'),
    spinning: flattenSpinning(data.spinning),
    autoconer: flattenAutoconer(data.autoconer),
    total: data.total
  };

  const res = await api.post(endpoint, transformedData);
  return res.data;
};

export const updateProduction = async (id: string, data: Partial<ProductionData>) => {
  const transformedData = {
    ...data,
    selected_orders: data.selectedOrders?.map(order => order.id),
  } as Record<string, unknown>;

  const res = await api.put(`${endpoint}/${id}`, transformedData);
  return res.data;
};

export const deleteProduction = async (id: string) => {
  const res = await api.delete(`${endpoint}/${id}`);
  return res.data;
};

// ✅ Analytics and Efficiency APIs
export const getDailyEfficiency = () => {
  return api.get(`${endpoint}/efficiency/daily`).then(res => {
    return res.data;
  });
};

export const getMachineEfficiency = () => {
  return api.get(`${endpoint}/efficiency/machine`).then(res => {
    return res.data;
  });
};

export const getProductionAnalytics = () => {
  return api.get(`${endpoint}/analytics`).then(res => {
    return res.data;
  });
};

export const getProductionLogs = () => {
  return api.get(`${endpoint}/logs`).then(res => {
    return res.data;
  });
};

export const getProductionByDate = async (date: string) => {
  const res = await api.get(`${endpoint}/date/${date}`);
  return res.data;
};

export const saveProduction = async (data: ProductionData) => {
  const transformedData = {
    ...data,
    selected_orders: data.selectedOrders.map(order => order.id),
  } as Record<string, unknown>;

  const res = await api.post(`${endpoint}/entry`, transformedData);
  return res.data;
};

export const submitProduction = async (date: string) => {
  const res = await api.post(`${endpoint}/submit`, { date });
  return res.data;
};

// List with pagination and filters
export const listProductions = async (params: any = {}) => {
  const res = await api.get(endpoint, { params });
  return res.data;
};