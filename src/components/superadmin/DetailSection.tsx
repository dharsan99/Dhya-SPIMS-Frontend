import React from 'react';

interface DetailSectionProps {
  title: string;
  rows: { label: string; value: React.ReactNode }[];
  centered?: boolean;
}

const DetailSection: React.FC<DetailSectionProps> = ({ title, rows}) => {
  return (
    <div className="p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 w-full">
      <div className={`font-semibold text-gray-700 dark:text-gray-300 mb-3 sm:mb-2 text-center sm:text-left`}>{title}</div>
      <div className="w-full flex justify-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm w-full max-w-xl">
          {rows.map((row, idx) => (
            <div key={idx} className='text-center sm:text-left'>
              <span className="font-medium">{row.label}</span> {row.value}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DetailSection; 