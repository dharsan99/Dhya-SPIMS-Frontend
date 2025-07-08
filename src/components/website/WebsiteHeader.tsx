import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const WebsiteHeader = () => {
  const { pathname } = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" },
  ];

  return (
    <header className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-md shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-extrabold text-blue-600 dark:text-white">
            Dhya
          </span>
          <span className="text-lg font-semibold text-gray-800 dark:text-gray-300 tracking-wide">
            SPIMS
          </span>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <div key={link.path} className="relative group">
              <Link
                to={link.path}
                className={`text-sm font-semibold ${
                  pathname === link.path
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-300"
                } transition`}
              >
                {link.label}
              </Link>

              {/* Animated Underline */}
              {pathname === link.path && (
                <motion.div
                  layoutId="underline"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-600 rounded-full"
                />
              )}
            </div>
          ))}

          <Link
            to="/login"
            className="ml-4 inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-full shadow transition-transform transform hover:-translate-y-1"
          >
            Login
          </Link>
        </nav>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 rounded-md text-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Toggle Menu"
        >
          {/* Hamburger or X icon */}
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-md overflow-hidden"
          >
            <div className="flex flex-col gap-6 py-6 px-6 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`hover:text-blue-600 ${
                    pathname === link.path ? "text-blue-600" : ""
                  } transition`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/login"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full shadow transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </header>
  );
};

export default WebsiteHeader;