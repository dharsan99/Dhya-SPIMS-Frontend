// src/api/marketing.ts

import api from './axios';
import { Campaign } from '../types/marketing';

export const sendBulkEmail = (data: {
  toEmails: string[];
  subject: string;
  bodyHtml: string;
  tenant_id: string;
}) => {
  return api.post('/marketing/send', data);
};

export const sendToAudience = (data: {
  audienceId: string;
  subject: string;
  bodyHtml: string;
  tenant_id: string;
}) => {
  return api.post('/marketing/send-to-audience', data);
};

export const getCampaigns = async (): Promise<Campaign[]> => {
  const response = await api.get('/marketing/campaigns');
  return response.data;
};

export const getCampaignById = async (id: string): Promise<Campaign> => {
  const response = await api.get(`/marketing/campaigns/${id}`);
  return response.data;
};

export const getCampaignMissedEmails = async (id: string) => {
  const response = await api.get(`/marketing/campaigns/${id}/missed-emails`);
  return response.data;
};

export const resendMissedEmails = async (id: string, data: {
  resendType?: 'missed' | 'sent_but_not_delivered' | 'all_failed';
  batchSize?: number;
  delayBetweenBatches?: number;
}) => {
  const response = await api.post(`/marketing/campaigns/${id}/resend-missed`, data);
  return response.data;
};

export const getCampaignStatus = async (id: string) => {
  const response = await api.get(`/marketing/campaigns/${id}/status`);
  return response.data;
};

export const analyzeDirectEmails = async (data: {
  originalEmailList: string[];
  subject: string;
  bodyHtml: string;
  tenant_id: string;
  startDate?: string;
  endDate?: string;
}) => {
  const response = await api.post('/marketing/analyze-direct-emails', data);
  return response.data;
};

export const resendDirectMissed = async (data: {
  originalEmailList: string[];
  subject: string;
  bodyHtml: string;
  tenant_id: string;
  startDate?: string;
  endDate?: string;
  batchSize?: number;
  delayBetweenBatches?: number;
}) => {
  const response = await api.post('/marketing/resend-direct-missed', data);
  return response.data;
};

export const fetchEmailDetails = async (data: {
  emailIds: string[];
  delayMs?: number;
}) => {
  const response = await api.post('/marketing/fetch-email-details', data);
  return response.data;
};