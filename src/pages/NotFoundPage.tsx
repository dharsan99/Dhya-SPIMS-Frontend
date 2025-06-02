// src/pages/NotFoundPage.tsx

import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-white px-6">
      
      {/* Big 404 */}
      <h1 className="text-8xl font-bold mb-4 animate-fadeInUp">404</h1>

      {/* Subtitle */}
      <p className="text-2xl font-semibold mb-2 animate-fadeInUp delay-75">
        Page Not Found
      </p>

      {/* Description */}
      <p className="text-gray-500 dark:text-gray-400 mb-6 text-center max-w-md animate-fadeInUp delay-100">
        The page you're looking for might have been moved, deleted, or it never existed.
      </p>

      {/* Go Home Button */}
      <Link
        to="/"
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition transform hover:scale-105 animate-fadeInUp delay-150"
      >
        Go to Home
      </Link>
    </div>
  );
};

export default NotFoundPage;