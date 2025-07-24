import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { analyzeDirectEmails, resendDirectMissed } from '../../api/marketing';
import { getMailingLists } from '../../api/mailingList';
import { getEmailTemplates } from '../../api/emailTemplates';
import { MailingList } from '../../types/mailingList';
import { EmailTemplate } from '../../types/marketing';
import { FiMail, FiUsers, FiTrendingUp, FiEye, FiAlertCircle, FiCheckCircle, FiXCircle, FiChevronDown } from 'react-icons/fi';

interface AnalysisResult {
  totalOriginalEmails: number;
  sentEmails: string[];
  deliveredEmails: string[];
  openedEmails: string[];
  clickedEmails: string[];
  bouncedEmails: string[];
  missedEmails: string[];
  summary: {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    bounced: number;
    missed: number;
  };
}

const DirectEmailRecovery: React.FC = () => {
  const [selectedMailingListId, setSelectedMailingListId] = useState<string>('');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [subject, setSubject] = useState('');
  const [bodyHtml, setBodyHtml] = useState('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [showEmailList, setShowEmailList] = useState(false);

  // Fetch mailing lists
  const { data: mailingLists = [] } = useQuery<MailingList[]>({
    queryKey: ['mailingLists'],
    queryFn: getMailingLists,
  });

  // Fetch email templates
  const { data: emailTemplates = [] } = useQuery<EmailTemplate[]>({
    queryKey: ['emailTemplates'],
    queryFn: getEmailTemplates,
  });

  const analyzeMutation = useMutation({
    mutationFn: analyzeDirectEmails,
    onSuccess: (data) => {
      setAnalysisResult(data.analysis);
      setIsAnalyzing(false);
    },
    onError: (error) => {
      console.error('Analysis failed:', error);
      setIsAnalyzing(false);
    }
  });

  const resendMutation = useMutation({
    mutationFn: resendDirectMissed,
    onSuccess: (data) => {
      alert(`Resend completed! ${data.summary.sentSuccessfully} emails sent successfully.`);
      setIsResending(false);
    },
    onError: (error) => {
      console.error('Resend failed:', error);
      setIsResending(false);
    }
  });

  // Get selected mailing list
  const selectedMailingList = mailingLists.find(list => list.id === selectedMailingListId);

  // Get selected template
  const selectedTemplate = emailTemplates.find(template => template.id === selectedTemplateId);

  // Extract emails from selected mailing list
  const getEmailsFromMailingList = (mailingList: MailingList): string[] => {
    const emails: string[] = [];
    
    // Add emails from mailingListBuyers
    mailingList.mailingListBuyers.forEach(mlb => {
      if (mlb.buyer?.email) {
        emails.push(mlb.buyer.email);
      }
    });
    
    // Add emails from mailingListRecipients (if the property exists)
    if ('mailingListRecipients' in mailingList && Array.isArray(mailingList.mailingListRecipients)) {
      mailingList.mailingListRecipients.forEach((recipient: any) => {
        if (recipient.email) {
          emails.push(recipient.email);
        }
      });
    }
    
    return [...new Set(emails)]; // Remove duplicates
  };

  // Handle template selection
  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplateId(templateId);
    if (templateId) {
      const template = emailTemplates.find(t => t.id === templateId);
      if (template) {
        setSubject(template.subject);
        setBodyHtml(template.bodyHtml);
      }
    } else {
      setSubject('');
      setBodyHtml('');
    }
  };

  const handleAnalyze = () => {
    if (!selectedMailingListId || !subject.trim() || !bodyHtml.trim()) {
      alert('Please select a mailing list and fill in subject and content');
      return;
    }

    if (!selectedMailingList) {
      alert('Selected mailing list not found');
      return;
    }

    const emails = getEmailsFromMailingList(selectedMailingList);
    
    if (emails.length === 0) {
      alert('No emails found in the selected mailing list');
      return;
    }
    
    setIsAnalyzing(true);
    analyzeMutation.mutate({
      originalEmailList: emails,
      subject,
      bodyHtml,
      tenant_id: '3bf6ce0f-f1dd-4cee-865b-e73552d7b25b', // Your tenant ID
    });
  };

  const handleResend = () => {
    if (!analysisResult || analysisResult.summary.missed === 0 || !selectedMailingList) {
      alert('No missed emails to resend');
      return;
    }

    const emails = getEmailsFromMailingList(selectedMailingList);
    
    setIsResending(true);
    resendMutation.mutate({
      originalEmailList: emails,
      subject,
      bodyHtml,
      tenant_id: '3bf6ce0f-f1dd-4cee-865b-e73552d7b25b', // Your tenant ID
      batchSize: 100,
      delayBetweenBatches: 1000
    });
  };

  const getStatusColor = (type: string) => {
    const colors = {
      sent: 'text-blue-600',
      delivered: 'text-green-600',
      opened: 'text-purple-600',
      clicked: 'text-indigo-600',
      bounced: 'text-red-600',
      missed: 'text-orange-600',
    };
    return colors[type as keyof typeof colors] || 'text-gray-600';
  };

  const selectedEmails = selectedMailingList ? getEmailsFromMailingList(selectedMailingList) : [];

  return (
    <div className="space-y-6 bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
      <div className="flex items-center gap-3">
        <FiMail className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Direct Email Recovery</h2>
      </div>
      
      <p className="text-gray-600 dark:text-gray-400">
        Analyze and resend emails that were sent directly through Resend (without campaign tracking).
      </p>

      {/* Input Form */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select Mailing List
          </label>
          <div className="relative">
            <select
              value={selectedMailingListId}
              onChange={(e) => setSelectedMailingListId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white appearance-none"
            >
              <option value="">Choose a mailing list...</option>
              {mailingLists.map((list) => {
                const emailCount = getEmailsFromMailingList(list).length;
                return (
                  <option key={list.id} value={list.id}>
                    {list.name} ({emailCount} emails)
                  </option>
                );
              })}
            </select>
            <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          {selectedMailingList && (
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                Selected: <span className="font-medium">{selectedMailingList.name}</span> 
                with <span className="font-medium">{selectedEmails.length} emails</span>
              </p>
              <button
                onClick={() => setShowEmailList(!showEmailList)}
                className="text-sm text-blue-600 hover:text-blue-700 mt-1"
              >
                {showEmailList ? 'Hide' : 'Show'} email list
              </button>
              {showEmailList && (
                <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded border max-h-32 overflow-y-auto">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedEmails.slice(0, 20).join(', ')}
                    {selectedEmails.length > 20 && ` ... and ${selectedEmails.length - 20} more`}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select Email Template (Optional)
          </label>
          <div className="relative">
            <select
              value={selectedTemplateId}
              onChange={(e) => handleTemplateSelect(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white appearance-none"
            >
              <option value="">Choose a template (or leave empty for manual input)...</option>
              {emailTemplates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>
            <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          {selectedTemplate && (
            <p className="text-sm text-gray-500 mt-1">
              Template selected: <span className="font-medium">{selectedTemplate.name}</span>
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Subject
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Your original email subject"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            HTML Content
          </label>
          <textarea
            value={bodyHtml}
            onChange={(e) => setBodyHtml(e.target.value)}
            placeholder="<p>Your original email HTML content</p>"
            className="w-full h-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !selectedMailingListId}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAnalyzing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Analyzing...
              </>
            ) : (
              <>
                <FiTrendingUp className="w-4 h-4" />
                Analyze Emails
              </>
            )}
          </button>

          {analysisResult && analysisResult.summary.missed > 0 && (
            <button
              onClick={handleResend}
              disabled={isResending}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {isResending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Resending...
                </>
              ) : (
                <>
                  <FiMail className="w-4 h-4" />
                  Resend Missed ({analysisResult.summary.missed})
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Analysis Results */}
      {analysisResult && (
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Analysis Results</h3>
          
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-700 p-3 rounded-lg border">
              <div className="flex items-center gap-2">
                <FiUsers className={`w-4 h-4 ${getStatusColor('sent')}`} />
                <span className="text-sm text-gray-500 dark:text-gray-400">Total</span>
              </div>
              <div className="text-xl font-bold text-gray-900 dark:text-white">
                {analysisResult.totalOriginalEmails}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-700 p-3 rounded-lg border">
              <div className="flex items-center gap-2">
                <FiCheckCircle className={`w-4 h-4 ${getStatusColor('sent')}`} />
                <span className="text-sm text-gray-500 dark:text-gray-400">Sent</span>
              </div>
              <div className="text-xl font-bold text-blue-600">
                {analysisResult.summary.sent}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-700 p-3 rounded-lg border">
              <div className="flex items-center gap-2">
                <FiXCircle className={`w-4 h-4 ${getStatusColor('missed')}`} />
                <span className="text-sm text-gray-500 dark:text-gray-400">Missed</span>
              </div>
              <div className="text-xl font-bold text-orange-600">
                {analysisResult.summary.missed}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-700 p-3 rounded-lg border">
              <div className="flex items-center gap-2">
                <FiTrendingUp className={`w-4 h-4 ${getStatusColor('delivered')}`} />
                <span className="text-sm text-gray-500 dark:text-gray-400">Delivered</span>
              </div>
              <div className="text-xl font-bold text-green-600">
                {analysisResult.summary.delivered}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-700 p-3 rounded-lg border">
              <div className="flex items-center gap-2">
                <FiEye className={`w-4 h-4 ${getStatusColor('opened')}`} />
                <span className="text-sm text-gray-500 dark:text-gray-400">Opened</span>
              </div>
              <div className="text-xl font-bold text-purple-600">
                {analysisResult.summary.opened}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-700 p-3 rounded-lg border">
              <div className="flex items-center gap-2">
                <FiAlertCircle className={`w-4 h-4 ${getStatusColor('bounced')}`} />
                <span className="text-sm text-gray-500 dark:text-gray-400">Bounced</span>
              </div>
              <div className="text-xl font-bold text-red-600">
                {analysisResult.summary.bounced}
              </div>
            </div>
          </div>

          {/* Detailed Lists */}
          {analysisResult.missedEmails.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Missed Emails ({analysisResult.missedEmails.length})
              </h4>
              <div className="bg-white dark:bg-gray-700 p-3 rounded border max-h-32 overflow-y-auto">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {analysisResult.missedEmails.slice(0, 10).join(', ')}
                  {analysisResult.missedEmails.length > 10 && ` ... and ${analysisResult.missedEmails.length - 10} more`}
                </div>
              </div>
            </div>
          )}

          {analysisResult.bouncedEmails.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Bounced Emails ({analysisResult.bouncedEmails.length})
              </h4>
              <div className="bg-white dark:bg-gray-700 p-3 rounded border max-h-32 overflow-y-auto">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {analysisResult.bouncedEmails.slice(0, 10).join(', ')}
                  {analysisResult.bouncedEmails.length > 10 && ` ... and ${analysisResult.bouncedEmails.length - 10} more`}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DirectEmailRecovery; 