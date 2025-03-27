import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { loginUser } from '../api/auth';
import useAuthStore from '../hooks/auth';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const setAuth = useAuthStore((state) => state.setAuth); // ✅ only setAuth now
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      console.log('✅ Login success:', data);
      console.log('📦 User:', data.user);
      console.log('🔐 Token:', data.token);

      setAuth(data.token, data.user); // ✅ set everything here
      navigate('/dashboard');
    },
    onError: (err) => {
      console.error('❌ Login failed:', err);
      alert('Invalid credentials');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🔁 Submitting credentials:', { email, password });
    mutation.mutate({ email, password });
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center text-blue-600">
          Dhya SPIMS Login
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-2 mb-4 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-2 mb-6 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 w-full rounded hover:bg-blue-700 transition"
        >
          {mutation.isPending ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}