import React, { useState } from 'react';
import ParsingUsagePanel from '../../components/superadmin/usage/ParsingUsagePanel';
import TenantUsageBreakdown from '../../components/superadmin/usage/TenantUsageBreakdown';
import EmailUsagePanel from '../../components/superadmin/usage/EmailUsagePanel';
import { ParsingUsageStats, ParsingMetrics } from '../../types/usage';
import EmailUsageBreakdown from '@/components/superadmin/usage/EmailUsageBreakdown';

export interface TenantEmailUsage {
  tenant_id: string;
  tenant_name: string;
  emails_sent: number;
  email_limit: number;
  usage_percentage: number;
  last_sent_at: string;
}

const dummyStats: ParsingUsageStats = {
  totalOrdersParsed: 1240,
  parsingLimit: 2000,
  parsingUsagePercentage: 62,
  successfulParses: 1200,
  failedParses: 40,
  successRate: 96.8,
  averageProcessingTime: 18,
  lastParsedAt: new Date().toISOString(),
  monthlyParses: [
    { month: 'Jan 2024', successfulParses: 180, failedParses: 5, totalParses: 185 },
    { month: 'Feb 2024', successfulParses: 200, failedParses: 7, totalParses: 207 },
    { month: 'Mar 2024', successfulParses: 210, failedParses: 6, totalParses: 216 },
    { month: 'Apr 2024', successfulParses: 220, failedParses: 8, totalParses: 228 },
    { month: 'May 2024', successfulParses: 190, failedParses: 9, totalParses: 199 },
    { month: 'Jun 2024', successfulParses: 200, failedParses: 5, totalParses: 205 },
  ],
  tenantUsage: [
    {
      tenantId: 'T001',
      tenantName: 'ABC Spinning Mills',
      ordersParsed: 400,
      parsingLimit: 600,
      usagePercentage: 67,
      lastParsedAt: new Date().toISOString(),
    },
    {
      tenantId: 'T002',
      tenantName: 'XYZ Textiles',
      ordersParsed: 320,
      parsingLimit: 500,
      usagePercentage: 64,
      lastParsedAt: new Date().toISOString(),
    },
    {
      tenantId: 'T003',
      tenantName: 'PQR Fabrics',
      ordersParsed: 250,
      parsingLimit: 400,
      usagePercentage: 62.5,
      lastParsedAt: new Date().toISOString(),
    },
    {
      tenantId: 'T004',
      tenantName: 'LMN Yarns',
      ordersParsed: 270,
      parsingLimit: 500,
      usagePercentage: 54,
      lastParsedAt: new Date().toISOString(),
    },
  ],
};


const dummyTenantEmailUsage = [
  {
    tenantId: 'T001',
    tenantName: 'ABC Spinning Mills',
    emailsSent: 1200,
    emailLimit: 2000,
    usagePercentage: 60,
    lastSentAt: new Date().toISOString(),
  },
  {
    tenantId: 'T002',
    tenantName: 'XYZ Textiles',
    emailsSent: 1500,
    emailLimit: 2000,
    usagePercentage: 75,
    lastSentAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
  },
  {
    tenantId: 'T003',
    tenantName: 'PQR Fabrics',
    emailsSent: 1800,
    emailLimit: 2000,
    usagePercentage: 90,
    lastSentAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
  },
  {
    tenantId: 'T004',
    tenantName: 'LMN Yarns',
    emailsSent: 400,
    emailLimit: 1000,
    usagePercentage: 40,
    lastSentAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(), // 1 day ago
  },
];

const dummyMetrics: ParsingMetrics = {
  totalFilesProcessed: 1500,
  pdfFiles: 1200,
  imageFiles: 300,
  averageFileSize: 2.1 * 1024 * 1024, // 2.1 MB
  totalProcessingTime: 54000, // 15 hours
  ocrUsageCount: 320,
  directTextExtractionCount: 1180,
};

const dummyEmailStats = {
  total_emails_sent: 3200,
  email_limit: 5000,
  usage_percentage: 64,
  successful_emails: 3100,
  failed_emails: 100,
  success_rate: 96.9,
  average_processing_time: 3,
  last_sent_at: new Date().toISOString(),
  monthly_emails: [
    { month: 'Jan 2024', successful_emails: 500, failed_emails: 10, total_emails: 510 },
    { month: 'Feb 2024', successful_emails: 520, failed_emails: 12, total_emails: 532 },
    { month: 'Mar 2024', successful_emails: 530, failed_emails: 15, total_emails: 545 },
    { month: 'Apr 2024', successful_emails: 540, failed_emails: 20, total_emails: 560 },
    { month: 'May 2024', successful_emails: 500, failed_emails: 18, total_emails: 518 },
    { month: 'Jun 2024', successful_emails: 510, failed_emails: 25, total_emails: 535 },
  ],
};

const ParsingUsage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'parsing' | 'email'>('parsing');

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4 overflow-x-auto hide-scrollbar">
        <button
          className={`py-2 px-4 text-sm font-medium transition-colors whitespace-nowrap ${
            activeTab === 'parsing'
              ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('parsing')}
        >
          Parsing Order Usage
        </button>
        <button
          className={`py-2 px-4 text-sm font-medium transition-colors whitespace-nowrap ${
            activeTab === 'email'
              ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('email')}
        >
          Email Usage
        </button>
      </div>

      {/* Panels */}
      {activeTab === 'parsing' && (
        <>
          <ParsingUsagePanel stats={dummyStats} metrics={dummyMetrics} />
          <div className="mt-8">
            <TenantUsageBreakdown tenantUsage={dummyStats.tenantUsage} />
          </div>
        </>
      )}
       {activeTab === 'email' && (
     <>
       <EmailUsagePanel stats={dummyEmailStats} />
       <div className="mt-8">
         <EmailUsageBreakdown tenantEmailUsage={dummyTenantEmailUsage} />
       </div>
     </>
   )}
    </div>
  );
};

export default ParsingUsage; 