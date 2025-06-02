import api from './axios';
import { CreateMailingListDto, MailingList } from '../types/mailingList';
import { Buyer } from '../types/buyer';

const endpoint = '/api/mailing-lists';

/**
 * ✅ Get all mailing lists
 */
export const getMailingLists = async (): Promise<MailingList[]> => {
  const res = await api.get(endpoint);
  return res.data;
};

export const getBuyers = async (): Promise<Buyer[]> => {
    const res = await api.get('/buyers');
    return res.data;
  };

/**
 * ✅ Get a single mailing list by ID
 */
export const getMailingListById = async (id: string): Promise<MailingList> => {
  const res = await api.get(`${endpoint}/${id}`);
  return res.data;
};

/**
 * ✅ Create new mailing list
 */
export const createMailingList = (data: CreateMailingListDto) => {
    return api.post('/api/mailing-lists', data);
  };

/**
 * ✅ Update existing mailing list
 */
export const updateMailingList = (id: string, data: { name: string; buyerIds: string[] }) => {
    return api.put(`${endpoint}/${id}`, data);
  };

/**
 * ✅ Delete mailing list
 */
export const deleteMailingList = (id: string) => {
  console.log(`🗑️ Deleting mailing list ${id}`);
  return api.delete(`${endpoint}/${id}`);
};