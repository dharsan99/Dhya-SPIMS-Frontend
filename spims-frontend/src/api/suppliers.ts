import api from './axios';

const endpoint = '/suppliers';

// Get all suppliers
export const getAllSuppliers = () => api.get(endpoint);

// Get supplier by ID
export const getSupplierById = (id: string) => api.get(`${endpoint}/${id}`);

// Create a new supplier
export const createSupplier = (data: {
  name: string;
  contact?: string;
  email?: string;
  address?: string;
}) => api.post(endpoint, data);

// Update an existing supplier
export const updateSupplier = (
  id: string,
  data: Partial<{
    name: string;
    contact?: string;
    email?: string;
    address?: string;
  }>
) => api.put(`${endpoint}/${id}`, data);

// Delete a supplier
export const deleteSupplier = (id: string) => api.delete(`${endpoint}/${id}`);