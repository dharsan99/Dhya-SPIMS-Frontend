import api from './axios';

// Email Events
export const getEmailEvents = (params?: {
  campaignId?: string;
  recipient?: string;
  eventType?: string;
  limit?: number;
  offset?: number;
}) => {
  return api.get('/api/webhooks/events', { params });
};

// Email Analytics
export const getEmailAnalytics = (params?: {
  campaignId?: string;
  days?: number;
}) => {
  return api.get('/api/webhooks/analytics', { params });
};

// Bounced Emails
export const getBouncedEmails = (params?: {
  bounceType?: 'HARD' | 'SOFT' | 'SUPPRESSED';
  limit?: number;
  offset?: number;
}) => {
  return api.get('/api/webhooks/bounces', { params });
};

// Remove Bounced Email
export const removeBouncedEmail = (email: string) => {
  return api.delete(`/api/webhooks/bounces/${encodeURIComponent(email)}`);
};

// Campaign Analytics
export const getCampaignAnalytics = (campaignId: string) => {
  return api.get(`/marketing/campaigns/${campaignId}`);
}; 