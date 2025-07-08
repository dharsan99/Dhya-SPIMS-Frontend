import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import WebsiteHeader from '../components/website/WebsiteHeader';
import WebsiteFooter from '../components/website/WebsiteFooter';
import { verifyEmail } from '@/api/signup';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['verify-email', token],
    queryFn: () => verifyEmail(token!),
    enabled: !!token,
    retry: false,
  });

  let status: 'verifying' | 'success' | 'error' = 'verifying';
  let message = '';

  if (!token) {
    status = 'error';
    message = 'Verification token is missing.';
  } else if (isLoading) {
    status = 'verifying';
    message = 'Verifying your email...';
  } else if (isError) {
    status = 'error';
    // @ts-ignore
    message = error?.response?.data?.message || 'Verification failed.';
  } else if (data) {
    status = 'success';
    message = data.message || 'Email verified successfully! You can now log in.';
  }

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
          <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white text-center">
            Email Verification
          </h1>

          {status === 'verifying' ? (
            <p className="text-gray-600 dark:text-gray-400 text-center">{message}</p>
          ) : (
            <>
              <p
                className={`text-lg font-medium text-center mb-4 ${
                  status === 'success' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}
              >
                {message}
              </p>
              {status === 'success' && (
                <button
                  onClick={() => navigate('/login')}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full transition shadow-md mt-2"
                >
                  Go to Login
                </button>
              )}
            </>
          )}
        </motion.div>
      </main>

      <WebsiteFooter />
    </motion.div>
  );
}
