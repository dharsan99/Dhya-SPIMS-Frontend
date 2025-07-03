// src/api/potentialBuyers.ts
import axios from './axios';
import { PotentialBuyer } from '../types/potentialBuyer';

// GET: All potential buyers
export const getPotentialBuyers = async (): Promise<PotentialBuyer[]> => {
  const res = await axios.get('/potential-buyers');
  return res.data;
};

// ✅ POST: Upload new potential buyers
export const uploadPotentialBuyers = async (
  buyers: Omit<PotentialBuyer, 'id'>[]
): Promise<void> => {
  await axios.post('/potential-buyers/upload', {
    buyers, // ✅ use function parameter, not an undefined variable
  });
};