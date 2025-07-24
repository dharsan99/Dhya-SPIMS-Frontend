import React, { useState, useRef } from 'react';
import { Upload } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createMailingList } from '../../api/mailingList';
import { CreateMailingListDto, MailingListRecipient } from '../../types/mailingList';
import toast from 'react-hot-toast';
import { TailwindDialog } from '../ui/Dialog';
import DownloadTemplateButton from './DownloadTemplateButton';
import { validateEmailBatch, getValidationFeedback, BatchValidationResult } from '../../utils/emailValidator';

interface CSVRow {
  name: string;
  email: string;
  company: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const CSVUploadModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState('');
  const [csvData, setCsvData] = useState<CSVRow[]>([]);
  const [listName, setListName] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [validationResult, setValidationResult] = useState<BatchValidationResult | null>(null);

  const createMutation = useMutation({
    mutationFn: createMailingList,
    onSuccess: () => {
      toast.success('Mailing list created from CSV');
      queryClient.invalidateQueries({ queryKey: ['mailingLists'] });
      onClose();
      resetForm();
    },
    onError: () => toast.error('Failed to create mailing list'),
  });

  const resetForm = () => {
    setFileName('');
    setCsvData([]);
    setListName('');
    setErrors([]);
    setValidationResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };



  const parseCSV = (file: File): Promise<CSVRow[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const csv = event.target?.result as string;
          const lines = csv.split('\n');
          const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
          
          console.log('CSV Headers:', headers);
          
          const data: CSVRow[] = [];
          const skippedRows: string[] = [];
          let generatedCount = 0;

          // Determine column mapping based on headers
          const emailIndex = headers.findIndex(h => h === 'email' || h === 'e-mail');
          const nameIndex = headers.findIndex(h => h === 'name' || h === 'first_name' || h === 'full_name');
          const firstNameIndex = headers.findIndex(h => h === 'first_name');
          const lastNameIndex = headers.findIndex(h => h === 'last_name');
          const companyIndex = headers.findIndex(h => h === 'company' || h === 'organization');

          if (emailIndex === -1) {
            reject(new Error('No email column found. Please ensure your CSV has an "email" column.'));
            return;
          }

          // Process each row (skip header)
          for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            const values = line.split(',').map(v => v.trim().replace(/^["']|["']$/g, ''));
            
            const rawEmail = values[emailIndex];
            if (!rawEmail) {
              skippedRows.push(`Row ${i + 1}: Missing email`);
              continue;
            }

            // Extract name information
            let name = '';
            if (firstNameIndex !== -1 && lastNameIndex !== -1) {
              const firstName = values[firstNameIndex] || '';
              const lastName = values[lastNameIndex] || '';
              name = `${firstName} ${lastName}`.trim();
            } else if (nameIndex !== -1) {
              name = values[nameIndex] || '';
            }

            // Extract company
            let company = '';
            if (companyIndex !== -1) {
              company = values[companyIndex] || '';
            }

            // Auto-generate missing data
            let wasGenerated = false;
            if (!name) {
              const emailDomain = rawEmail.split('@')[1];
              if (emailDomain) {
                const domainParts = emailDomain.split('.');
                name = domainParts[0].charAt(0).toUpperCase() + domainParts[0].slice(1) + ' User';
              } else {
                name = 'Unknown User';
              }
              wasGenerated = true;
            }

            if (!company) {
              const emailDomain = rawEmail.split('@')[1];
              if (emailDomain) {
                const domainParts = emailDomain.split('.');
                company = domainParts[0].charAt(0).toUpperCase() + domainParts[0].slice(1) + ' Company';
              } else {
                company = 'Unknown Company';
              }
              wasGenerated = true;
            }

            if (wasGenerated) {
              generatedCount++;
            }

            data.push({
              name,
              email: rawEmail,
              company,
            });
          }

          // Validate all emails
          const emails = data.map(row => row.email);
          const validationResult = validateEmailBatch(emails);
          setValidationResult(validationResult);

          // Filter data to only include valid emails
          const validData = data.filter((row) => 
            validationResult.validEmails.includes(validationResult.correctedEmails.find(c => c.original === row.email)?.corrected || row.email)
          );

          // Show warning if some rows were skipped
          if (skippedRows.length > 0) {
            setErrors(skippedRows);
          }

          // Show info about generated data
          if (generatedCount > 0) {
            toast.success(`${generatedCount} contacts had missing names/companies and were auto-generated`);
          }

          // Show validation feedback
          const feedback = getValidationFeedback(validationResult);
          toast.success(feedback.summary);

          resolve(validData);
        } catch (error) {
          reject(new Error('Failed to parse CSV file'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.csv')) {
      toast.error('Please upload a CSV file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error('File size must be less than 5MB');
      return;
    }

    setErrors([]);

    try {
      const data = await parseCSV(file);
      setCsvData(data);
      setFileName(file.name);
      
      if (errors.length > 0) {
        toast.success(`Successfully imported ${data.length} contacts (${errors.length} rows skipped)`);
      } else {
        toast.success(`Successfully imported ${data.length} contacts`);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to parse CSV');
    }
  };

  const handleSubmit = () => {
    if (!listName.trim() || csvData.length === 0) {
      toast.error('Please provide a list name and upload a CSV file');
      return;
    }

    if (!validationResult) {
      toast.error('Please wait for email validation to complete');
      return;
    }

    // Use the corrected emails from validation
    const recipients: MailingListRecipient[] = csvData.map(row => {
      // Find if this email was corrected
      const correction = validationResult.correctedEmails.find(c => c.original === row.email);
      const finalEmail = correction ? correction.corrected : row.email;
      
      return {
        name: row.name,
        email: finalEmail,
        company: row.company,
        source: 'potential' as const,
      };
    });

    const payload: CreateMailingListDto = {
      name: listName.trim(),
      recipients,
    };

    createMutation.mutate(payload);
  };



  return (
    <TailwindDialog isOpen={isOpen} onClose={onClose} title="Upload CSV Contacts" maxWidth="max-w-4xl">
      <div className="space-y-6 max-h-[75vh] overflow-y-auto">
        {/* File Upload Section */}
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            {fileName || 'Click to upload CSV file'}
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
          >
            Choose File
          </button>
          <DownloadTemplateButton variant="secondary" className="ml-3" />
        </div>

        {/* Validation Results */}
        {validationResult && (
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              📊 Validation Results
            </h3>
            
            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {validationResult.summary.total}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total</div>
              </div>
              <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {validationResult.summary.valid}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Valid</div>
              </div>
              <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {validationResult.summary.corrected}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Corrected</div>
              </div>
              <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {validationResult.summary.invalid}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Invalid</div>
              </div>
            </div>

            {/* Corrections */}
            {validationResult.correctedEmails.length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  🔧 Auto-Corrected Emails
                </h4>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {validationResult.correctedEmails.slice(0, 10).map((correction, index) => (
                    <div key={index} className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="line-through">{correction.original}</span> → 
                      <span className="text-green-600 dark:text-green-400 font-medium"> {correction.corrected}</span>
                    </div>
                  ))}
                  {validationResult.correctedEmails.length > 10 && (
                    <div className="text-sm text-gray-500">
                      ... and {validationResult.correctedEmails.length - 10} more
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Invalid Emails */}
            {validationResult.invalidEmails.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  ❌ Invalid Emails (Skipped)
                </h4>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {validationResult.invalidEmails.slice(0, 10).map((error, index) => (
                    <div key={index} className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="text-red-600 dark:text-red-400">{error.email}</span>
                      <span className="text-gray-500"> - {error.error}</span>
                    </div>
                  ))}
                  {validationResult.invalidEmails.length > 10 && (
                    <div className="text-sm text-gray-500">
                      ... and {validationResult.invalidEmails.length - 10} more
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* List Name Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Mailing List Name
          </label>
          <input
            type="text"
            value={listName}
            onChange={(e) => setListName(e.target.value)}
            placeholder="e.g., Newsletter Subscribers"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white rounded hover:bg-gray-400 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!listName.trim() || csvData.length === 0 || createMutation.isPending}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {createMutation.isPending ? 'Creating...' : `Create List (${csvData.length} contacts)`}
          </button>
        </div>
      </div>
    </TailwindDialog>
  );
};

export default CSVUploadModal; 