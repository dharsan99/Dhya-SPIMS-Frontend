import React from 'react';
import { Download } from 'lucide-react';

interface DownloadTemplateButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const DownloadTemplateButton: React.FC<DownloadTemplateButtonProps> = ({ 
  variant = 'secondary', 
  size = 'md',
  className = ''
}) => {
  const handleDownloadTemplate = () => {
    // 1. Define the CSV headers with example data
    const headers = ['email', 'first_name', 'last_name', 'company'];
    const exampleRow = ['john.doe@example.com', 'John', 'Doe', 'Acme Corp'];
    const csvContent = [
      headers.join(','),
      exampleRow.join(','),
      // Add a few more example rows for clarity
      'jane.smith@example.com,Jane,Smith,Tech Solutions',
      'bob.wilson@example.com,Bob,Wilson,Global Industries'
    ].join('\n');

    // 2. Create a Blob from the CSV content
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    // 3. Create a temporary URL for the Blob
    const url = URL.createObjectURL(blob);

    // 4. Create a temporary anchor tag to trigger the download
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'contacts_template.csv');
    link.style.visibility = 'hidden';

    // 5. Append to the DOM, trigger the click, and then remove it
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // 6. Clean up the object URL
    URL.revokeObjectURL(url);
  };

  // Base classes
  const baseClasses = 'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  // Variant classes
  const variantClasses = {
    primary: 'bg-blue-600 text-white shadow-sm hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'border border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-indigo-500'
  };
  
  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <button
      onClick={handleDownloadTemplate}
      type="button"
      className={buttonClasses}
      title="Download CSV template with example data"
    >
      <Download className="h-4 w-4" />
      Download Template
    </button>
  );
};

export default DownloadTemplateButton; 