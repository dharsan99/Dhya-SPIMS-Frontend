import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const COOKIE_CONSENT_KEY = "cookie_consent_accepted";

const CookieConsentBanner = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      // Delay showing banner slightly
      setTimeout(() => setShowBanner(true), 500);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "true");
    setShowBanner(false);
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed bottom-0 inset-x-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-300 dark:border-gray-700 p-4 md:p-5 text-sm text-gray-700 dark:text-gray-300 flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg"
        >
          <div className="text-center md:text-left">
            We use cookies to enhance your experience. By continuing to use our site, you accept our{" "}
            <a href="/privacy-policy" className="text-blue-600 hover:underline">
              Privacy Policy
            </a>
            .
          </div>
          <button
            onClick={handleAccept}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2 rounded-full transition-all"
          >
            Accept
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsentBanner;