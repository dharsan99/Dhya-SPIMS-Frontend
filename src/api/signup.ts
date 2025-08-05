import axios from 'axios';
import api from './axios';

export const signup = async ({
  name,
  email,
  password,
  tenantId,
}: {
  name: string;
  email: string;
  password: string;
  tenantId: string;
}) => {
  console.log('api')
  const response = await axios.post('https://dhya-spims-backend.onrender.com/signup', {
    name,
    email,
    password,
    tenantId, // 👈 use tenant_id as key
  });

  return response.data;
};


export const verifyEmail = async (token: string) => {
    const response = await axios.get(`https://dhya-spims-backend.onrender.com/verify-email?token=${token}`);
    return response.data;
  };


  export const sendInvite = async ({
    email,
    roleId,
    tenantId,
  }: {
    email: string;
    roleId: string;
    tenantId: string;
  }) => {
    const res = await api.post('/auth/invite', { email, roleId, tenantId });
    return res.data;
  };

export const acceptInvite = async ({
  name,
  token,
  password,
}: {
  name: string;
  token: string;
  password: string;
}) => {
  const response = await api.post('/auth/accept-invite', {
    name,
    token,
    password,
  });
  return response.data;
};

export const createTenant = async ({
  name,
  domain,
  address,
  industry,
  phone,
}: {
  name: string;
  domain?: string;
  address?: string;
  industry?: string;
  phone?: string;
}) => {
  const response = await axios.post('https://dhya-spims-backend.onrender.com/tenants', {
    name,
    domain,
    address,
    industry,
    phone,
  });
  return response.data;
};
  