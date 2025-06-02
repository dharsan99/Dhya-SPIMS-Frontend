import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import WebsiteHeader from '../components/website/WebsiteHeader';
import WebsiteFooter from '../components/website/WebsiteFooter';
import LoginModal from '../components/website/LoginModal';
import useAuthStore from '../hooks/auth';

export default function LoginPage() {
  const [fadeOutPage, setFadeOutPage] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const { token } = useAuthStore();
  const navigate = useNavigate();

  const handleLoginClick = () => setShowLoginForm(true);
  const handleSignupClick = () => {
    window.open('https://calendly.com/dharsan-dhya/spims-meeting', '_blank');
  };  const handleDashboardAccess = () => navigate('/app/dashboard');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col min-h-screen relative overflow-hidden transition-colors duration-300 bg-gray-50 dark:bg-gray-900"
    >
      {/* Particles Background */}
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

      {/* Website Header */}
      <WebsiteHeader />

      {/* Main Content */}
      <main className="flex flex-1 items-center justify-center px-4 py-16">
        {!showLoginForm ? (
          <div className="flex flex-col items-center text-center space-y-8 max-w-2xl">
            
            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight"
            >
              Manage Production Smarter, <br /> Scale Faster.
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-lg md:text-xl text-gray-600 dark:text-gray-300"
            >
              Dhya SPIMS empowers factories to streamline fibers, shades, orders, and production workflows — simple, scalable, and powerful.
            </motion.p>

            {/* Features List */}
            <div className="flex flex-col gap-3 mt-4 text-left text-gray-700 dark:text-gray-300">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Real-time inventory & production insights
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                Smarter order & shade management
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
                Fast, cloud-based, lightweight platform
              </div>
            </div>

            {/* Action Card */}
            <div className="mt-8 bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-8 w-full max-w-sm border border-gray-100 dark:border-gray-700">
              {!token ? (
                <>
                  <button
                    onClick={handleLoginClick}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full transition shadow-md"
                  >
                    Sign In
                  </button>
                  <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                    Don't have an account?{' '}
                    <button
                      onClick={handleSignupClick}
                      className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                    >
                      Sign Up
                    </button>
                  </p>
                </>
              ) : (
                <button
                  onClick={handleDashboardAccess}
                  className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-full transition shadow-md"
                >
                  Access Dashboard
                </button>
              )}
            </div>

          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md"
          >
            <LoginModal setFadeOutPage={setFadeOutPage} />
          </motion.div>
        )}
      </main>

      {/* Website Footer */}
      <WebsiteFooter />

      {/* Loading Spinner on fade out */}
      {fadeOutPage && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-black/70 backdrop-blur-md z-50">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </motion.div>
  );
}