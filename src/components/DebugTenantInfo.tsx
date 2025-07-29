import React from 'react';
import useAuthStore from '@/hooks/auth';
import useTenantStore from '@/hooks/useTenantStore';

const DebugTenantInfo: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const tenantId = useTenantStore((state) => state.tenantId);
  const debugTenantInfo = useTenantStore((state) => state.debugTenantInfo);
  const clearLocalStorageTenant = useTenantStore((state) => state.clearLocalStorageTenant);

  const handleClearLocalStorage = () => {
    clearLocalStorageTenant();
    window.location.reload();
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-w-md z-50">
      <h3 className="text-sm font-bold mb-2 text-gray-900 dark:text-white">Debug Tenant Info</h3>
      <div className="text-xs space-y-1 text-gray-600 dark:text-gray-400">
        <div><strong>User Tenant ID:</strong> {user?.tenantId || 'null'}</div>
        <div><strong>Store Tenant ID:</strong> {tenantId || 'null'}</div>
        <div><strong>User Role:</strong> {user?.role?.name || 'null'}</div>
        <div><strong>User Email:</strong> {user?.email || 'null'}</div>
        <div><strong>Match:</strong> {user?.tenantId === tenantId ? '✅' : '❌'}</div>
      </div>
      <div className="mt-2 space-x-2">
        <button
          onClick={debugTenantInfo}
          className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Debug Store
        </button>
        <button
          onClick={handleClearLocalStorage}
          className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
        >
          Clear & Reload
        </button>
      </div>
    </div>
  );
};

export default DebugTenantInfo; 