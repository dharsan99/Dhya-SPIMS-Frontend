
export const getStatusBadge = (status: 'active' | 'inactive') => (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
      status === 'active'
        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
        : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );