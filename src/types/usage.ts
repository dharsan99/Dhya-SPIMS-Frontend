export interface ParsingUsageStats {
  totalOrdersParsed: number;
  parsingLimit: number;
  parsingUsagePercentage: number;
  successfulParses: number;
  failedParses: number;
  successRate: number;
  averageProcessingTime: number;
  lastParsedAt: string;
  monthlyParses: MonthlyParseData[];
  tenantUsage: TenantParseUsage[];
}

export interface MonthlyParseData {
  month: string;
  successfulParses: number;
  failedParses: number;
  totalParses: number;
}

export interface TenantParseUsage {
  tenantId: string;
  tenantName: string;
  ordersParsed: number;
  parsingLimit: number;
  usagePercentage: number;
  lastParsedAt: string;
}

export interface ParsingLimit {
  tenantId: string;
  monthlyLimit: number;
  currentUsage: number;
  resetDate: string;
}

export interface ParsingMetrics {
  totalFilesProcessed: number;
  pdfFiles: number;
  imageFiles: number;
  averageFileSize: number;
  totalProcessingTime: number;
  ocrUsageCount: number;
  directTextExtractionCount: number;
} 