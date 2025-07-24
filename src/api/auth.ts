import axios from './axios';

export const loginUser = async (credentials: { email: string; password: string }) => {
  const response = await axios.post('http://192.168.0.2:5001/auth/login', credentials);
  console.log('response',response.data);
  return response.data;
};