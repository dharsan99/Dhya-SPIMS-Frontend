import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="w-full h-[200px] flex items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent dark:border-blue-400 dark:border-t-transparent"></div>
    </div>
  );
};

export default Loader;