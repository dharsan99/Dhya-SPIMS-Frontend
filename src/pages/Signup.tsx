import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import WebsiteHeader from '../components/website/WebsiteHeader';
import WebsiteFooter from '@/components/website/WebsiteFooter';
import { signup } from '@/api/signup';
import { toast } from 'sonner';
import axios from 'axios';

export default function SignupPage() {
  const [step, setStep] = useState(1);
  const [orgData, setOrgData] = useState({ orgName: '', domain: '' });
  const [userData, setUserData] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Step 1: Org submit
  const handleOrgSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/tenants', {
        name: orgData.orgName,
        domain: orgData.domain || undefined,
      });
      setStep(2);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to create organization.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: User submit
  const handleUserSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signup({
        name: userData.username,
        email: userData.email,
        password: userData.password,
      });
      toast.success('Signup successful. Please check your email to verify your account.');
      navigate('/login');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Signup failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col min-h-screen relative overflow-hidden transition-colors duration-300 bg-gray-50 dark:bg-gray-900"
    >
      <AnimatePresence />
      <WebsiteHeader />
      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-8 border border-gray-100 dark:border-gray-700"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            {step === 1 ? 'Organization Details' : 'Create Your Account'}
          </h2>
          {step === 1 ? (
            <form onSubmit={handleOrgSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Organization Name
                </label>
                <input
                  type="text"
                  name="orgName"
                  required
                  value={orgData.orgName}
                  onChange={e => setOrgData({ ...orgData, orgName: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Domain <span className="text-xs text-gray-400">(optional)</span>
                </label>
                <input
                  type="text"
                  name="domain"
                  value={orgData.domain}
                  onChange={e => setOrgData({ ...orgData, domain: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full transition shadow-md"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Next'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleUserSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  required
                  value={userData.username}
                  onChange={e => setUserData({ ...userData, username: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={userData.email}
                  onChange={e => setUserData({ ...userData, email: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  required
                  value={userData.password}
                  onChange={e => setUserData({ ...userData, password: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full transition shadow-md"
                disabled={loading}
              >
                {loading ? 'Signing up...' : 'Sign Up'}
              </button>
            </form>
          )}
          <p className="mt-4 text-sm text-center text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <button
              onClick={handleLoginRedirect}
              className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
            >
              Sign In
            </button>
          </p>
        </motion.div>
      </main>
      <WebsiteFooter />
    </motion.div>
  );
}
