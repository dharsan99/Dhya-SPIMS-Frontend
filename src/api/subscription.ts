import api from './axios';


export const fetchSubscription = async (tenantId: string) => {
  const response = await api.get('/subscriptions', {
    params: { tenantId },
  });

  console.log('response')
  return response.data;
};

export const fetchUsage = async () => {
  const response = await api.get('/subscriptions/usage');
  return response.data;
};

export const fetchBillingHistory = async (tenantId?: string) => {
  const response = await api.get('/subscriptions/billing-history/tenant', {
    params: tenantId ? { tenantId } : {},
  });
  return response.data;
};
