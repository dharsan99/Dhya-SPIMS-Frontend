import { useEffect, useState } from 'react';

const DebugInfo = () => {
  const [debugInfo, setDebugInfo] = useState({
    windowSize: { width: 0, height: 0 },
    userAgent: '',
    theme: '',
    timestamp: new Date().toISOString(),
  });

  useEffect(() => {
    const updateDebugInfo = () => {
      setDebugInfo({
        windowSize: { width: window.innerWidth, height: window.innerHeight },
        userAgent: navigator.userAgent,
        theme: document.documentElement.className,
        timestamp: new Date().toISOString(),
      });
    };

    updateDebugInfo();
    window.addEventListener('resize', updateDebugInfo);
    
    return () => window.removeEventListener('resize', updateDebugInfo);
  }, []);

  // Only show in development
  if (import.meta.env.PROD) return null;

  return (
    <div className="fixed top-4 left-4 bg-black bg-opacity-75 text-white p-4 rounded-lg text-xs font-mono z-50 max-w-xs">
      <h3 className="font-bold mb-2">Debug Info</h3>
      <div className="space-y-1">
        <div>Window: {debugInfo.windowSize.width}x{debugInfo.windowSize.height}</div>
        <div>Theme: {debugInfo.theme}</div>
        <div>Time: {debugInfo.timestamp}</div>
        <div className="text-yellow-300">React is working!</div>
      </div>
    </div>
  );
};

export default DebugInfo; 