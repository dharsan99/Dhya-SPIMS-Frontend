export interface ParsingUsageStats {
  total_orders_parsed: number;
  parsing_limit: number;
  parsing_usage_percentage: number;
  successful_parses: number;
  failed_parses: number;
  success_rate: number;
  average_processing_time: number;
  last_parsed_at: string;
  monthly_parses: MonthlyParseData[];
  tenant_usage: TenantParseUsage[];
}

export interface MonthlyParseData {
  month: string;
  successful_parses: number;
  failed_parses: number;
  total_parses: number;
}

export interface TenantParseUsage {
  tenant_id: string;
  tenant_name: string;
  orders_parsed: number;
  parsing_limit: number;
  usage_percentage: number;
  last_parsed_at: string;
}

export interface ParsingLimit {
  tenant_id: string;
  monthly_limit: number;
  current_usage: number;
  reset_date: string;
}

export interface ParsingMetrics {
  total_files_processed: number;
  pdf_files: number;
  image_files: number;
  average_file_size: number;
  total_processing_time: number;
  ocr_usage_count: number;
  direct_text_extraction_count: number;
} 