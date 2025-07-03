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
  total_orders_parsed: 1240,
  parsing_limit: 2000,
  parsing_usage_percentage: 62,
  successful_parses: 1200,
  failed_parses: 40,
  success_rate: 96.8,
  average_processing_time: 18,
  last_parsed_at: new Date().toISOString(),
  monthly_parses: [
    { month: 'Jan 2024', successful_parses: 180, failed_parses: 5, total_parses: 185 },
    { month: 'Feb 2024', successful_parses: 200, failed_parses: 7, total_parses: 207 },
    { month: 'Mar 2024', successful_parses: 210, failed_parses: 6, total_parses: 216 },
    { month: 'Apr 2024', successful_parses: 220, failed_parses: 8, total_parses: 228 },
    { month: 'May 2024', successful_parses: 190, failed_parses: 9, total_parses: 199 },
    { month: 'Jun 2024', successful_parses: 200, failed_parses: 5, total_parses: 205 },
  ],
  tenant_usage: [
    {
      tenant_id: 'T001',
      tenant_name: 'ABC Spinning Mills',
      orders_parsed: 400,
      parsing_limit: 600,
      usage_percentage: 67,
      last_parsed_at: new Date().toISOString(),
    },
    {
      tenant_id: 'T002',
      tenant_name: 'XYZ Textiles',
      orders_parsed: 320,
      parsing_limit: 500,
      usage_percentage: 64,
      last_parsed_at: new Date().toISOString(),
    },
    {
      tenant_id: 'T003',
      tenant_name: 'PQR Fabrics',
      orders_parsed: 250,
      parsing_limit: 400,
      usage_percentage: 62.5,
      last_parsed_at: new Date().toISOString(),
    },
    {
      tenant_id: 'T004',
      tenant_name: 'LMN Yarns',
      orders_parsed: 270,
      parsing_limit: 500,
      usage_percentage: 54,
      last_parsed_at: new Date().toISOString(),
    },
  ],
};


const dummyTenantEmailUsage = [
  {
    tenant_id: 'T001',
    tenant_name: 'ABC Spinning Mills',
    emails_sent: 1200,
    email_limit: 2000,
    usage_percentage: 60,
    last_sent_at: new Date().toISOString(),
  },
  {
    tenant_id: 'T002',
    tenant_name: 'XYZ Textiles',
    emails_sent: 1500,
    email_limit: 2000,
    usage_percentage: 75,
    last_sent_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
  },
  {
    tenant_id: 'T003',
    tenant_name: 'PQR Fabrics',
    emails_sent: 1800,
    email_limit: 2000,
    usage_percentage: 90,
    last_sent_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
  },
  {
    tenant_id: 'T004',
    tenant_name: 'LMN Yarns',
    emails_sent: 400,
    email_limit: 1000,
    usage_percentage: 40,
    last_sent_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(), // 1 day ago
  },
];

const dummyMetrics: ParsingMetrics = {
  total_files_processed: 1500,
  pdf_files: 1200,
  image_files: 300,
  average_file_size: 2.1 * 1024 * 1024, // 2.1 MB
  total_processing_time: 54000, // 15 hours
  ocr_usage_count: 320,
  direct_text_extraction_count: 1180,
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
            <TenantUsageBreakdown tenantUsage={dummyStats.tenant_usage} />
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