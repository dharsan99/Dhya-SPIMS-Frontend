// components/purchase-orders/FileUploadPanel.tsx
import React, { useState, useRef } from 'react';
import { 
  DocumentArrowUpIcon, 
  XMarkIcon, 
  CheckCircleIcon,
  ExclamationTriangleIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

interface Props {
  file: File | null;
  loading: boolean;
  error: string;
  onFileChange: (file: File | null) => void;
  onCancel: () => void;
  onParse: () => void;
}

const FileUploadPanel: React.FC<Props> = ({
  file,
  loading,
  error,
  onFileChange,
  onCancel,
  onParse,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      const file = droppedFiles[0];
      if (isValidFileType(file)) {
        onFileChange(file);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && isValidFileType(selectedFile)) {
      onFileChange(selectedFile);
    }
  };

  const isValidFileType = (file: File): boolean => {
    const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    return validTypes.includes(file.type);
  };

  const getFileIcon = (file: File) => {
    if (file.type === 'application/pdf') {
      return '📄';
    }
    return '🖼️';
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* File Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
          isDragOver
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : file
            ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
            : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {!file ? (
          <div className="space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
              <DocumentArrowUpIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Upload Purchase Order Document
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Drag and drop your PDF or image file here, or click to browse
              </p>
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <span>Supported formats:</span>
                <span className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">PDF</span>
                <span className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">PNG</span>
                <span className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">JPG</span>
              </div>
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              <SparklesIcon className="w-5 h-5 mr-2" />
              Choose File
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                <CheckCircleIcon className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-center space-x-2">
                <span className="text-2xl">{getFileIcon(file)}</span>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {file.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <span className="text-sm text-green-600 dark:text-green-400">
                  ✓ File ready for processing
                </span>
              </div>
            </div>
            <button
              onClick={() => onFileChange(null)}
              className="inline-flex items-center px-3 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 text-sm font-medium"
            >
              <XMarkIcon className="w-4 h-4 mr-1" />
              Remove File
            </button>
          </div>
        )}
        
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.png,.jpg,.jpeg"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
            <span className="text-red-800 dark:text-red-200 text-sm">{error}</span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3">
        <button
          onClick={onCancel}
          className="px-6 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onParse}
          disabled={!file || loading}
          className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Processing...
            </>
          ) : (
            <>
              <SparklesIcon className="w-4 h-4 mr-2" />
              Extract & Parse
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default FileUploadPanel;