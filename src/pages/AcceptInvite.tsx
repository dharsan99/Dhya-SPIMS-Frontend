import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import WebsiteHeader from '../components/website/WebsiteHeader';
import WebsiteFooter from '../components/website/WebsiteFooter';
import { acceptInvite } from '@/api/signup';
import { toast } from 'react-hot-toast';

export default function AcceptInvitePage() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'form' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setStatus('error');
      setMessage('Invitation token is missing.');
      return;
    }
    setStatus('form');
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('Name is required.');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }
    const token = searchParams.get('token');
    if (!token) {
      toast.error('Invalid invitation link.');
      return;
    }
    setIsSubmitting(true);
    try {
      const data = await acceptInvite({ name, token, password });
      if (data.user_id) {
        setStatus('success');
        setMessage(data.message || 'Account created successfully! You can now log in.');
        toast.success(data.message || 'Account created successfully!');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setStatus('error');
        setMessage(data.message || 'Failed to accept invitation.');
        toast.error(data.message || 'Failed to accept invitation.');
      }
    } catch (error: any) {
      setStatus('error');
      const errorMessage = error?.response?.data?.message || 'Failed to accept invitation.';
      setMessage(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col min-h-screen relative overflow-hidden transition-colors duration-300 bg-gray-50 dark:bg-gray-900"
    >
      <WebsiteHeader />

      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-8 border border-gray-100 dark:border-gray-700"
        >
          <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white text-center">
            Accept Invitation
          </h1>

          {status === 'loading' && (
            <p className="text-gray-600 dark:text-gray-400 text-center">Loading invitation...</p>
          )}

          {status === 'form' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Set Your Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-full transition shadow-md"
              >
                {isSubmitting ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
          )}

          {status === 'success' && (
            <div className="text-center">
              <p className="text-lg font-medium text-green-600 dark:text-green-400 mb-4">
                {message}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Redirecting to login page...
              </p>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center">
              <p className="text-lg font-medium text-red-600 dark:text-red-400 mb-4">
                {message}
              </p>
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
              >
                Go to Login
              </button>
            </div>
          )}
        </motion.div>
      </main>

      <WebsiteFooter />
    </motion.div>
  );
} 