import axios from 'axios';
import api from './axios';

export const signup = async ({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}) => {
  const response = await api.post('/signup', {
    name,
    email,
    password,
  });

  return response.data;
};


export const verifyEmail = async (token: string) => {
    const response = await axios.get(`http://192.168.0.2:5001/verify-email?token=${token}`);
    return response.data;
  };


  export const sendInvite = async ({
    email,
    role_id,
    tenant_id,
  }: {
    email: string;
    role_id: string;
    tenant_id: string;
  }) => {
    const res = await api.post('/auth/invite', { email, role_id, tenant_id });
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
  