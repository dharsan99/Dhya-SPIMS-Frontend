import React from 'react';
import ParsingUsagePanel from '../../components/superadmin/usage/ParsingUsagePanel';
import TenantUsageBreakdown from '../../components/superadmin/usage/TenantUsageBreakdown';
import { ParsingUsageStats, ParsingMetrics } from '../../types/usage';

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

const dummyMetrics: ParsingMetrics = {
  total_files_processed: 1500,
  pdf_files: 1200,
  image_files: 300,
  average_file_size: 2.1 * 1024 * 1024, // 2.1 MB
  total_processing_time: 54000, // 15 hours
  ocr_usage_count: 320,
  direct_text_extraction_count: 1180,
};

const ParsingUsage: React.FC = () => {
  return (
    <div className="space-y-6">
      <ParsingUsagePanel stats={dummyStats} metrics={dummyMetrics} />
      <div className="mt-8">
        <TenantUsageBreakdown tenantUsage={dummyStats.tenant_usage} />
      </div>
    </div>
  );
};

export default ParsingUsage; 