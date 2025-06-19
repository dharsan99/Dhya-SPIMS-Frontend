import React from 'react';

interface TruncatedTextProps {
  text: string;
  maxLength?: number;
  className?: string;
}

const TruncatedText: React.FC<TruncatedTextProps> = ({ 
  text, 
  maxLength = 6,
  className = ''
}) => {
  if (!text) return <i className="text-gray-400">—</i>;
  
  const truncated = text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  
  return (
    <span 
      className={`truncate ${className}`}
      title={text} // This creates the hover tooltip
    >
      {truncated}
    </span>
  );
};

export default TruncatedText; 