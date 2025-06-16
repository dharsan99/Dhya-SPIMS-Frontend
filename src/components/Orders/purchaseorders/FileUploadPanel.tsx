// components/purchase-orders/FileUploadPanel.tsx
import React from 'react';

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
  return (
    <>
      <input
        type="file"
        accept=".pdf,.png,.jpg,.jpeg"
        onChange={(e) => onFileChange(e.target.files?.[0] || null)}
        className="mb-4"
      />
      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
      <div className="flex gap-2">
        <button onClick={onCancel} className="px-4 py-2 bg-gray-300 rounded">
          Cancel
        </button>
        <button
          onClick={onParse}
          className="px-4 py-2 bg-blue-600 text-white rounded"
          disabled={!file || loading}
        >
          {loading ? 'Processing...' : 'Extract & Parse'}
        </button>
      </div>
    </>
  );
};

export default FileUploadPanel;