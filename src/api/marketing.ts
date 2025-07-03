// src/api/marketing.ts

import api from './axios';

export const sendBulkEmail = (data: {
  toEmails: string[];
  subject: string;
  bodyHtml: string;
  tenant_id: string;
}) => {
  return api.post('/marketing/send', data);
};

// ✅ ADD THIS FUNCTION
export const getCampaigns = () => {
  return api.get('/marketing/campaigns').then((res) => res.data);
};