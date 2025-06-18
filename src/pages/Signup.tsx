import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import WebsiteHeader from '../components/website/WebsiteHeader';
import WebsiteFooter from '../components/website/WebsiteFooter';
import SubscriptionPlanModal from '@/components/SubscriptionPlanModal';

export default function SignupPage() {
  const [fadeOutPage, setFadeOutPage] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [formData, setFormData] = useState({
    orgName: '',
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignup = (e: any) => {
    e.preventDefault();
    
    // Show subscription plan modal instead of direct navigation
    setShowPlanModal(true);
  };

  const handlePlanSelect = (plan: any) => {
    console.log('Selected plan:', plan);
    console.log('Signup data:', formData);
    
    // Simulate successful signup with plan selection
    setFadeOutPage(true);
    setTimeout(() => {
      navigate('/app/dashboard');
    }, 1500);
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
      {/* Particle Background */}
      <AnimatePresence>
        {!fadeOutPage && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 -z-10 pointer-events-none overflow-hidden"
          >
            {Array.from({ length: 30 }).map((_, i) => {
              const randomSize = Math.random() * 3 + 2;
              const randomDuration = 5 + Math.random() * 5;
              return (
                <div
                  key={i}
                  className="absolute rounded-full bg-white/40 dark:bg-white/20 animate-particle animate-twinkle"
                  style={{
                    width: `${randomSize}px`,
                    height: `${randomSize}px`,
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 5}s`,
                    animationDuration: `${randomDuration}s`,
                  }}
                />
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <WebsiteHeader />

      {/* Main Signup Content */}
      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-8 border border-gray-100 dark:border-gray-700"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Create Your Account
          </h2>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Organization Name
              </label>
              <input
                type="text"
                name="orgName"
                required
                value={formData.orgName}
                onChange={handleInputChange}
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
                value={formData.email}
                onChange={handleInputChange}
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
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full transition shadow-md"
            >
              Continue to Plan Selection
            </button>
          </form>

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

      {/* Subscription Plan Modal */}
      <SubscriptionPlanModal
        isOpen={showPlanModal}
        onClose={() => setShowPlanModal(false)}
        onPlanSelect={handlePlanSelect}
        formData={formData}
      />

      {/* Spinner on fade out */}
      {fadeOutPage && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-black/70 backdrop-blur-md z-50">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </motion.div>
  );
}