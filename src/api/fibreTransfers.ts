import api from './axios';
import { FibreTransfer } from '../types/fibreTransfer';

export interface FibreTransferInput {
  fibre_id: string;
  supplier_id: string;
  sent_kg: number;
  sent_date: string;
  remarks?: string;
}

export interface FibreTransferReceiveInput {
  received_qty: number;
  received_date: string;
  remarks?: string;
}



// ✅ Fetch all transfers
export const getAllFibreTransfers = async (): Promise<FibreTransfer[]> => {
  const response = await api.get('/fibre-transfers');
  return response.data;
};

// ✅ Fetch only pending supplier transfers

export const getPendingSupplierTransfers = async (): Promise<FibreTransfer[]> => {
    const response = await api.get('/fibre-transfers?status=pending');
    return response.data; // Now it’s typed as FibreTransfer[]
  };
// ✅ Create a new transfer
export const createFibreTransfer = async (
  data: FibreTransferInput
): Promise<FibreTransfer> => {
  const response = await api.post('/fibre-transfers', data);
  return response.data;
};

// ✅ Update a transfer as received
export const updateFibreTransferReceive = async (
  id: string,
  data: FibreTransferReceiveInput
): Promise<FibreTransfer> => {
  const response = await api.put(`/fibre-transfers/${id}/receive`, data);
  return response.data;
};
export const updateFibreTransfer = async (id: string, data: Partial<FibreTransfer>): Promise<FibreTransfer> => {
    const res = await api.put(`/fibre-transfers/${id}`, data);
    return res.data;
  };