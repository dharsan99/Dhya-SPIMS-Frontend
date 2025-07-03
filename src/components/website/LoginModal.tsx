import { useEffect, useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { loginUser } from '../../api/auth';
import useAuthStore from '../../hooks/auth';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-hot-toast';
import confetti from 'canvas-confetti';

interface LoginModalProps {
  setFadeOutPage: (val: boolean) => void;
}

export default function LoginModal({ setFadeOutPage }: LoginModalProps) {
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [shake, setShake] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  const emailRef = useRef<HTMLInputElement>(null);

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      setAuth(data.token, data.user);

      // 🎉 Confetti blast
      confetti({
        particleCount: 100,
        spread: 70,
        startVelocity: 40,
        gravity: 0.7,
        origin: { y: 0.5 },
        colors: ['#3B82F6', '#8B5CF6', '#EC4899', '#FBBF24'],
        scalar: 0.8,
        ticks: 200,
        zIndex: 9999,
      });

      toast.success(`Welcome back, ${data.user.name.split(' ')[0]}!`);

      setFadeOut(true);
      setFadeOutPage(true);

      setTimeout(() => {
        navigate('/app/dashboard');
      }, 1200);
    },
    onError: () => {
      toast.error('Invalid email or password');
      triggerShake();
    },
  });

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error('Please enter your email');
      emailRef.current?.focus();
      triggerShake();
      return;
    }
    if (!password) {
      toast.error('Please enter your password');
      triggerShake();
      return;
    }

    // Check for super-admin credentials
    if (email === 'superadmin@dhya.in' && password === '12345') {
      // Create super-admin user object
      const superAdminUser = {
        token: 'super-admin-token',
        user: {
          id: 'super-admin-1',
          tenant_id: 'super-admin-tenant',
          name: 'Super Admin',
          email: 'superadmin@dhya.in',
          role: {
            id: 'role-super-admin',
            tenant_id: 'super-admin-tenant',
            name: 'Super Admin Role',
            description: 'Full access to all resources',
            permissions: {
              '*': ['*'], // Grant all permissions on all resources
            },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      };

      setAuth(superAdminUser.token, superAdminUser.user);

      // 🎉 Confetti blast for super admin
      confetti({
        particleCount: 150,
        spread: 80,
        startVelocity: 50,
        gravity: 0.7,
        origin: { y: 0.5 },
        colors: ['#EF4444', '#DC2626', '#B91C1C', '#991B1B'],
        scalar: 1,
        ticks: 300,
        zIndex: 9999,
      });

      toast.success('Welcome, Super Admin!');

      setFadeOut(true);
      setFadeOutPage(true);

      setTimeout(() => {
        navigate('/superadmin/dashboard');
      }, 1200);
      return;
    }

    mutation.mutate({ email, password });
  };

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  return (
    <AnimatePresence>
      {!fadeOut && (
        <motion.div
          key={shake ? 'shake' : 'normal'}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: [0, -5, 0, 5, 0],
          }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{
            opacity: { duration: 0.6, ease: 'easeOut' },
            scale: { duration: 0.6, ease: 'easeOut' },
            y: {
              duration: 5,
              ease: 'easeInOut',
              repeat: Infinity,
              repeatType: 'mirror',
            },
          }}
          className="
            relative
            bg-white 
            dark:bg-gray-800
            p-8 
            rounded-3xl 
            shadow-2xl 
            shadow-blue-200/40 
            dark:shadow-blue-800/20
            w-full max-w-md
            border border-gray-200 
            dark:border-gray-700
            transition-all 
            duration-300
          "
        >
          <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-900 dark:text-white">
            Sign in to your account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block mb-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
                Email address
              </label>
              <input
                ref={emailRef}
                type="email"
                placeholder="you@example.com"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div className="relative">
              <label className="block mb-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
                Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="********"
                className="w-full px-4 py-2 pr-12 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-10 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>

              {/* Forgot Password */}
              <div className="text-right mt-2">
                <a href="#" className="text-sm text-blue-600 hover:underline dark:text-blue-400">
                  Forgot password?
                </a>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full flex items-center justify-center py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={!email || !password || mutation.isPending}
            >
              {mutation.isPending ? (
                <>
                  <svg
                    className="w-5 h-5 mr-2 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                  Logging in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}