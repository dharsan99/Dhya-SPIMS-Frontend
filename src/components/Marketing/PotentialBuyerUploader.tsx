import React, { useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import toast from 'react-hot-toast';

export interface PotentialBuyer {
  id: string;
  company: string;
  person: string;
  email: string;
}

interface Props {
  onUpload: (buyers: PotentialBuyer[]) => void;
}

const PotentialBuyerUploader: React.FC<Props> = ({ onUpload }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [fileName, setFileName] = useState('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' }) as any[];

      const formatted: PotentialBuyer[] = jsonData.map((row, idx) => ({
        id: `row-${idx}`,
        company: row['Company Name'] || '',
        person: row['Contact Person'] || '',
        email: row['Email'] || '',
      })).filter((entry) => entry.email);

      if (formatted.length === 0) {
        toast.error('No valid emails found');
        return;
      }

      onUpload(formatted);
      toast.success(`Imported ${formatted.length} potential buyers`);
    } catch (error) {
      toast.error('Failed to parse the Excel file');
    }
  };

  return (
    <div className="p-4 border rounded bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
      <div className="flex justify-between items-center mb-3">
        <span className="font-medium text-gray-800 dark:text-gray-200">
          Upload Potential Buyers (Excel)
        </span>
        <input
          type="file"
          ref={fileInputRef}
          accept=".xlsx,.xls"
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
        >
          Select File
        </button>
      </div>
      {fileName && (
        <div className="text-sm text-gray-600 dark:text-gray-400 italic">
          Selected: {fileName}
        </div>
      )}
    </div>
  );
};

export default PotentialBuyerUploader;