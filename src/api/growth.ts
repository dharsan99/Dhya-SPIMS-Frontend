// Growth Engine API - Updated to fix compilation cache issue
import axios from './axios';

// Types for Growth Engine
export interface CompanyPersona {
  id: string;
  tenant_id: string;
  tenantId: string;
  executiveSummary: string;
  targetMarketSweetSpot: string;
  swotAnalysis: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  detailedAnalysis: {
    productionAndQuality?: string;
    marketPositioningAndAdvantage?: string;
    coreExpertiseAndDifferentiators?: string;
    // Fallback fields for backward compatibility
    productionCapabilities?: string;
    coreExpertise?: string;
    marketPositioning?: string;
    competitiveAdvantages?: string[];
    marketChallenges?: string[];
    growthStrategies?: string[];
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GrowthCampaign {
  id: string;
  tenant_id: string;
  name: string;
  keywords: string[];
  region?: string;
  status: 'DRAFT' | 'ANALYZING' | 'READY_FOR_OUTREACH' | 'ACTIVE' | 'PAUSED' | 'COMPLETED';
  createdAt: string;
  updatedAt: string;
  discoveredBrands?: DiscoveredBrand[];
}

export interface DiscoveredBrand {
  id: string;
  campaignId: string;
  companyName: string;
  website?: string;
  productFitAnalysis: string;
  discoverySource?: string;
  status: 'DISCOVERED' | 'SUPPLIERS_IDENTIFIED' | 'CONTACTS_ENRICHED' | 'CONTACTED' | 'RESPONDED' | 'QUALIFIED' | 'CONVERTED';
  createdAt: string;
  updatedAt: string;
  discoveredSuppliers?: DiscoveredSupplier[];
}

export interface CreateCampaignRequest {
  name: string;
  keywords: string[];
  region?: string;
}

// Add DiscoveredSupplier interface after the existing interfaces
export interface DiscoveredSupplier {
  id: string;
  companyName: string;
  country?: string;
  specialization?: string;
  sourceUrl?: string;
  relevanceScore?: number;
  discoveredBrandId: string;
  discoveredBrand?: DiscoveredBrand;
  createdAt: string;
  updatedAt: string;
}

export interface TargetContact {
  id: string;
  name: string;
  title?: string;
  email?: string;
  linkedinUrl?: string;
  source?: string;
  discoveredSupplierId: string;
  discoveredSupplier?: DiscoveredSupplier;
  createdAt: string;
  updatedAt: string;
}

// Company Persona API
export const getCompanyPersona = async (): Promise<CompanyPersona | null> => {
  console.log('🔍 [GROWTH API] Getting company persona...');
  console.log('🔍 [GROWTH API] Request URL:', '/api/growth/persona');
  console.log('🔍 [GROWTH API] Request method: GET');
  
  try {
    console.log('🔍 [GROWTH API] Making API call...');
    const { data } = await axios.get('/api/growth/persona');
    console.log('✅ [GROWTH API] Company persona retrieved successfully');
    console.log('✅ [GROWTH API] Response data:', {
      id: data.id,
      tenant_id: data.tenant_id,
      isActive: data.isActive,
      executiveSummaryLength: data.executiveSummary?.length || 0,
      targetMarketSweetSpotLength: data.targetMarketSweetSpot?.length || 0,
      hasSwotAnalysis: !!data.swotAnalysis,
      hasDetailedAnalysis: !!data.detailedAnalysis,
      swotAnalysisKeys: data.swotAnalysis ? Object.keys(data.swotAnalysis) : [],
      detailedAnalysisKeys: data.detailedAnalysis ? Object.keys(data.detailedAnalysis) : [],
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    });
    
    // Debug: Log the actual data structure
    console.log('🔍 [GROWTH API] Full response data structure:', {
      executiveSummary: data.executiveSummary?.substring(0, 100) + '...',
      targetMarketSweetSpot: data.targetMarketSweetSpot?.substring(0, 100) + '...',
      swotAnalysis: data.swotAnalysis,
      detailedAnalysis: data.detailedAnalysis
    });
    
    return data;
  } catch (error: any) {
    console.error('❌ [GROWTH API] Error getting company persona:', error);
    console.error('❌ [GROWTH API] Error details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.message,
      responseData: error.response?.data
    });
    
    // Handle 404 specifically for when no persona exists
    if (error.response?.status === 404) {
      console.log('ℹ️ [GROWTH API] No persona found (404) - this is expected for new tenants');
      const errorMessage = error.response.data?.message || 'Company Persona not found for this tenant.';
      const customError = new Error(errorMessage);
      (customError as any).code = 'PERSONA_NOT_FOUND';
      (customError as any).status = 404;
      return null;
    }
    throw error;
  }
};

export const triggerEmailSend = async (emailId: string): Promise<{ 
  message: string; 
  status: string; 
  emailId: string;
  subject: string;
  recipient: string;
  contactName: string;
}> => {
  console.log('📤 [GROWTH API] Triggering email send...');
  console.log('📤 [GROWTH API] Email ID:', emailId);
  console.log('📤 [GROWTH API] Request URL:', `/api/growth/outreach-emails/${emailId}/send`);
  console.log('📤 [GROWTH API] Request method: POST');
  
  try {
    const { data } = await axios.post(`/api/growth/outreach-emails/${emailId}/send`);
    console.log('✅ [GROWTH API] Email send triggered successfully');
    console.log('✅ [GROWTH API] Response data:', {
      message: data.message,
      status: data.status,
      emailId: data.emailId,
      subject: data.subject,
      recipient: data.recipient,
      contactName: data.contactName
    });
    return data;
  } catch (error: any) {
    console.error('❌ [GROWTH API] Error triggering email send:', error);
    console.error('❌ [GROWTH API] Error details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.message,
      responseData: error.response?.data
    });
    throw error;
  }
};

export const resendEmail = async (emailId: string): Promise<{ 
  message: string; 
  originalEmailId: string;
  newDraftId: string;
  subject: string;
  contactName: string;
  contactEmail: string;
}> => {
  console.log('📧 [GROWTH API] Creating resend copy...');
  console.log('📧 [GROWTH API] Original Email ID:', emailId);
  console.log('📧 [GROWTH API] Request URL:', `/api/growth/outreach-emails/${emailId}/resend`);
  console.log('📧 [GROWTH API] Request method: POST');
  
  try {
    const { data } = await axios.post(`/api/growth/outreach-emails/${emailId}/resend`);
    console.log('✅ [GROWTH API] Resend copy created successfully');
    console.log('✅ [GROWTH API] Response data:', {
      message: data.message,
      originalEmailId: data.originalEmailId,
      newDraftId: data.newDraftId,
      subject: data.subject,
      contactName: data.contactName,
      contactEmail: data.contactEmail
    });
    return data;
  } catch (error: any) {
    console.error('❌ [GROWTH API] Error creating resend copy:', error);
    console.error('❌ [GROWTH API] Error details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.message,
      responseData: error.response?.data
    });
    throw error;
  }
};

// Analytics API Functions
export const getAnalyticsDashboard = async (timeframe: '7d' | '30d' | '90d' | '1y' = '30d'): Promise<AnalyticsDashboardResponse> => {
  console.log('📊 [GROWTH API] Getting analytics dashboard...');
  console.log('📊 [GROWTH API] Request URL:', `/api/growth/analytics/dashboard?timeframe=${timeframe}`);
  console.log('📊 [GROWTH API] Request method: GET');
  console.log('📊 [GROWTH API] Timeframe:', timeframe);
  
  try {
    const { data } = await axios.get(`/api/growth/analytics/dashboard?timeframe=${timeframe}`);
    console.log('✅ [GROWTH API] Analytics dashboard retrieved successfully');
    console.log('✅ [GROWTH API] Response data:', {
      tenantId: data.tenantId,
      timeframe: data.timeframe,
      totalCampaigns: data.overview.totalCampaigns,
      totalContacts: data.overview.totalContacts,
      totalEmails: data.overview.totalEmails,
      replyRate: data.performance.replyRate + '%',
      topCampaignsCount: data.topCampaigns.length
    });
    return data;
  } catch (error: any) {
    console.error('❌ [GROWTH API] Error getting analytics dashboard:', error);
    console.error('❌ [GROWTH API] Error details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.message,
      responseData: error.response?.data
    });
    throw error;
  }
};

export const getCampaignAnalytics = async (): Promise<CampaignAnalyticsResponse> => {
  console.log('📊 [GROWTH API] Getting campaign analytics...');
  console.log('📊 [GROWTH API] Request URL:', '/api/growth/analytics/campaigns');
  console.log('📊 [GROWTH API] Request method: GET');
  
  try {
    const { data } = await axios.get('/api/growth/analytics/campaigns');
    console.log('✅ [GROWTH API] Campaign analytics retrieved successfully');
    console.log('✅ [GROWTH API] Response data:', {
      tenantId: data.tenantId,
      totalCampaigns: data.overview.totalCampaigns,
      overallReplyRate: data.overview.overallReplyRate + '%',
      campaignsCount: data.campaigns.length
    });
    return data;
  } catch (error: any) {
    console.error('❌ [GROWTH API] Error getting campaign analytics:', error);
    console.error('❌ [GROWTH API] Error details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.message,
      responseData: error.response?.data
    });
    throw error;
  }
};

export const getGrowthMetrics = async (timeframe: '7d' | '30d' | '90d' | '1y' = '30d'): Promise<GrowthMetricsResponse> => {
  console.log('📈 [GROWTH API] Getting growth metrics...');
  console.log('📈 [GROWTH API] Request URL:', `/api/growth/analytics/growth-metrics?timeframe=${timeframe}`);
  console.log('📈 [GROWTH API] Request method: GET');
  console.log('📈 [GROWTH API] Timeframe:', timeframe);
  
  try {
    const { data } = await axios.get(`/api/growth/analytics/growth-metrics?timeframe=${timeframe}`);
    console.log('✅ [GROWTH API] Growth metrics retrieved successfully');
    console.log('✅ [GROWTH API] Response data:', {
      tenantId: data.tenantId,
      timeframe: data.timeframe,
      campaignsCreated: data.summary.campaignsCreated,
      contactsAcquired: data.summary.contactsAcquired,
      emailsGenerated: data.summary.emailsGenerated,
      timeSeriesDataPoints: data.timeSeries.campaigns.length
    });
    return data;
  } catch (error: any) {
    console.error('❌ [GROWTH API] Error getting growth metrics:', error);
    console.error('❌ [GROWTH API] Error details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.message,
      responseData: error.response?.data
    });
    throw error;
  }
};

export interface EmailEngagementStats {
  emailId: string;
  subject: string;
  status: 'DRAFT' | 'QUEUED' | 'SENT' | 'FAILED' | 'REPLIED';
  sentAt?: string;
  targetContact: {
    name: string;
    email?: string;
    company: string;
  };
  engagement: {
    totalEvents: number;
    openCount: number;
    clickCount: number;
    firstOpened?: string;
    firstClicked?: string;
    lastActivity?: string;
  };
  events: Array<{
    id: string;
    type: 'OPENED' | 'CLICKED';
    ipAddress?: string;
    userAgent?: string;
    createdAt: string;
  }>;
}

export const getEmailEngagementStats = async (emailId: string): Promise<EmailEngagementStats> => {
  console.log('📊 [GROWTH API] Getting email engagement stats...');
  console.log('📊 [GROWTH API] Request URL:', `/api/growth/outreach-emails/${emailId}/engagement-stats`);
  console.log('📊 [GROWTH API] Request method: GET');
  console.log('📊 [GROWTH API] Email ID:', emailId);
  
  try {
    const { data } = await axios.get(`/api/growth/outreach-emails/${emailId}/engagement-stats`);
    console.log('✅ [GROWTH API] Email engagement stats retrieved successfully');
    console.log('✅ [GROWTH API] Response data:', {
      emailId: data.emailId,
      subject: data.subject,
      status: data.status,
      totalEvents: data.engagement.totalEvents,
      openCount: data.engagement.openCount,
      clickCount: data.engagement.clickCount,
      lastActivity: data.engagement.lastActivity
    });
    return data;
  } catch (error: any) {
    console.error('❌ [GROWTH API] Error getting email engagement stats:', error);
    console.error('❌ [GROWTH API] Error details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.message,
      responseData: error.response?.data
    });
    throw error;
  }
};

export interface ContactSuppressionStatus {
  contactId: string;
  name: string;
  email?: string;
  company: string;
  status: 'ACTIVE' | 'DO_NOT_CONTACT';
  isSuppressed: boolean;
  canSendEmail: boolean;
}

export const checkContactSuppression = async (contactId: string): Promise<ContactSuppressionStatus> => {
  console.log('🚫 [GROWTH API] Checking contact suppression status...');
  console.log('🚫 [GROWTH API] Request URL:', `/api/growth/contacts/${contactId}/suppression-status`);
  console.log('🚫 [GROWTH API] Request method: GET');
  console.log('🚫 [GROWTH API] Contact ID:', contactId);
  
  try {
    const { data } = await axios.get(`/api/growth/contacts/${contactId}/suppression-status`);
    console.log('✅ [GROWTH API] Contact suppression status retrieved successfully');
    console.log('✅ [GROWTH API] Response data:', {
      contactId: data.contactId,
      name: data.name,
      company: data.company,
      status: data.status,
      isSuppressed: data.isSuppressed,
      canSendEmail: data.canSendEmail
    });
    return data;
  } catch (error: any) {
    console.error('❌ [GROWTH API] Error checking contact suppression status:', error);
    console.error('❌ [GROWTH API] Error details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.message,
      responseData: error.response?.data
    });
    throw error;
  }
};

// Analytics Interfaces
export interface CampaignMetrics {
  brandsDiscovered: number;
  suppliersIdentified: number;
  contactsEnriched: number;
  totalEmails: number;
  emailsSent: number;
  emailsReplied: number;
  emailsFailed: number;
  emailsQueued: number;
  totalOpens: number;
  totalClicks: number;
  uniqueOpens: number;
  uniqueClicks: number;
  activeContacts: number;
  suppressedContacts: number;
  openRate: string;
  clickRate: string;
  replyRate: string;
  bounceRate: string;
}

export interface CampaignAnalytics {
  campaignId: string;
  campaignName: string;
  campaignStatus: 'DRAFT' | 'ANALYZING' | 'READY_FOR_OUTREACH' | 'ACTIVE' | 'PAUSED' | 'COMPLETED';
  createdAt: string;
  updatedAt: string;
  keywords: string[];
  metrics: CampaignMetrics;
}

export interface AnalyticsOverview {
  totalCampaigns: number;
  totalBrands: number;
  totalSuppliers: number;
  totalContacts: number;
  totalEmails: number;
  totalSent: number;
  totalReplies: number;
  totalOpens: number;
  totalClicks: number;
  totalFailed: number;
  activeContacts: number;
  suppressedContacts: number;
  overallOpenRate: string;
  overallClickRate: string;
  overallReplyRate: string;
  overallBounceRate: string;
}

export interface CampaignAnalyticsResponse {
  tenantId: string;
  generatedAt: string;
  overview: AnalyticsOverview;
  campaigns: CampaignAnalytics[];
}

export interface TimeSeriesDataPoint {
  date: string;
  count: number;
}

export interface GrowthMetricsTimeSeries {
  campaigns: TimeSeriesDataPoint[];
  contacts: TimeSeriesDataPoint[];
  emails: TimeSeriesDataPoint[];
  emailsSent: TimeSeriesDataPoint[];
}

export interface GrowthMetricsSummary {
  campaignsCreated: number;
  contactsAcquired: number;
  emailsGenerated: number;
  emailsSent: number;
  campaignsByStatus: Record<string, number>;
  contactsByStatus: Record<string, number>;
  emailsByStatus: Record<string, number>;
}

export interface GrowthMetricsResponse {
  tenantId: string;
  timeframe: string;
  startDate: string;
  endDate: string;
  generatedAt: string;
  timeSeries: GrowthMetricsTimeSeries;
  summary: GrowthMetricsSummary;
}

export interface AnalyticsDashboardPerformance {
  emailsSent: number;
  emailsReplied: number;
  emailsFailed: number;
  emailsQueued: number;
  emailsDraft: number;
  totalOpens: number;
  totalClicks: number;
  uniqueOpens: number;
  uniqueClicks: number;
  openRate: string;
  clickRate: string;
  replyRate: string;
  bounceRate: string;
}

export interface AnalyticsDashboardOverview {
  totalCampaigns: number;
  totalBrands: number;
  totalSuppliers: number;
  totalContacts: number;
  totalEmails: number;
  totalEvents: number;
  activeContacts: number;
  suppressedContacts: number;
  pendingTasks: number;
}

export interface AnalyticsDashboardRecentActivity {
  campaignsCreated: number;
  contactsAcquired: number;
  emailsGenerated: number;
  engagementEvents: number;
}

export interface TopCampaignPerformance {
  campaignId: string;
  campaignName: string;
  status: string;
  contactsEnriched: number;
  emailsSent: number;
  emailsReplied: number;
  replyRate: string;
  totalEngagement: number;
  createdAt: string;
}

export interface AnalyticsDashboardBreakdowns {
  emailStatus: Record<string, number>;
  contactStatus: Record<string, number>;
  eventTypes: Record<string, number>;
  taskStatus: Record<string, number>;
  campaignStatus: Record<string, number>;
}

export interface AnalyticsDashboardResponse {
  tenantId: string;
  timeframe: string;
  generatedAt: string;
  overview: AnalyticsDashboardOverview;
  performance: AnalyticsDashboardPerformance;
  recentActivity: AnalyticsDashboardRecentActivity;
  topCampaigns: TopCampaignPerformance[];
  breakdowns: AnalyticsDashboardBreakdowns;
}

export const upsertCompanyPersona = async (personaData: {
  executiveSummary: string;
  targetMarketSweetSpot: string;
  swotAnalysis: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  detailedAnalysis: {
    productionAndQuality?: string;
    marketPositioningAndAdvantage?: string;
    coreExpertiseAndDifferentiators?: string;
    // Fallback fields for backward compatibility
    productionCapabilities?: string;
    coreExpertise?: string;
    marketPositioning?: string;
    competitiveAdvantages?: string[];
    marketChallenges?: string[];
    growthStrategies?: string[];
  };
}): Promise<CompanyPersona> => {
  console.log('💾 [GROWTH API] Upserting company persona...');
  console.log('💾 [GROWTH API] Request URL:', '/api/growth/persona');
  console.log('💾 [GROWTH API] Request method: POST');
  console.log('💾 [GROWTH API] Request payload:', {
    executiveSummaryLength: personaData.executiveSummary.length,
    targetMarketSweetSpotLength: personaData.targetMarketSweetSpot.length,
    hasSwotAnalysis: !!personaData.swotAnalysis,
    hasDetailedAnalysis: !!personaData.detailedAnalysis,
    swotAnalysisKeys: Object.keys(personaData.swotAnalysis),
    detailedAnalysisKeys: Object.keys(personaData.detailedAnalysis),
    executiveSummaryPreview: personaData.executiveSummary.substring(0, 100) + '...',
    targetMarketSweetSpotPreview: personaData.targetMarketSweetSpot.substring(0, 100) + '...'
  });
  
  try {
    const { data } = await axios.post('/api/growth/persona', personaData);
    console.log('✅ [GROWTH API] Company persona upserted successfully');
    console.log('✅ [GROWTH API] Response data:', {
      id: data.id,
      tenant_id: data.tenant_id,
      isActive: data.isActive,
      executiveSummaryLength: data.executiveSummary?.length || 0,
      targetMarketSweetSpotLength: data.targetMarketSweetSpot?.length || 0,
      hasSwotAnalysis: !!data.swotAnalysis,
      hasDetailedAnalysis: !!data.detailedAnalysis,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    });
    return data;
  } catch (error: any) {
    console.error('❌ [GROWTH API] Error upserting company persona:', error);
    console.error('❌ [GROWTH API] Error details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.message,
      responseData: error.response?.data
    });
    throw error;
  }
};

// Growth Campaigns API
export const getGrowthCampaigns = async (): Promise<GrowthCampaign[]> => {
  console.log('🔍 [GROWTH API] Getting growth campaigns...');
  console.log('🔍 [GROWTH API] Request URL:', '/api/growth/campaigns');
  console.log('🔍 [GROWTH API] Request method: GET');
  
  try {
    const { data } = await axios.get('/api/growth/campaigns');
    console.log('✅ [GROWTH API] Growth campaigns retrieved successfully');
    console.log('✅ [GROWTH API] Response data:', {
      count: data.length,
      campaigns: data.map((campaign: any) => ({
        id: campaign.id,
        name: campaign.name,
        status: campaign.status,
        keywordsCount: campaign.keywords?.length || 0
      }))
    });
    return data;
  } catch (error: any) {
    console.error('❌ [GROWTH API] Error getting growth campaigns:', error);
    console.error('❌ [GROWTH API] Error details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.message,
      responseData: error.response?.data
    });
    throw error;
  }
};

export const createGrowthCampaign = async (campaign: {
  name: string;
  keywords: string[];
  region?: string;
}): Promise<GrowthCampaign> => {
  console.log('🚀 [GROWTH API] Creating growth campaign...');
  console.log('🚀 [GROWTH API] Request URL:', '/api/growth/campaigns');
  console.log('🚀 [GROWTH API] Request method: POST');
  console.log('🚀 [GROWTH API] Request payload:', campaign);
  
  try {
    const { data } = await axios.post('/api/growth/campaigns', campaign);
    console.log('✅ [GROWTH API] Growth campaign created successfully');
    console.log('✅ [GROWTH API] Response data:', {
      id: data.id,
      name: data.name,
      status: data.status,
      keywordsCount: data.keywords?.length || 0,
      createdAt: data.createdAt
    });
    return data;
  } catch (error: any) {
    console.error('❌ [GROWTH API] Error creating growth campaign:', error);
    console.error('❌ [GROWTH API] Error details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.message,
      responseData: error.response?.data
    });
    throw error;
  }
};

export const updateCampaignStatus = async (
  campaignId: string,
  status: GrowthCampaign['status']
): Promise<GrowthCampaign> => {
  console.log('🔄 [GROWTH API] Updating campaign status...');
  console.log('🔄 [GROWTH API] Request URL:', `/api/growth/campaigns/${campaignId}/status`);
  console.log('🔄 [GROWTH API] Request method: PUT');
  console.log('🔄 [GROWTH API] Request payload:', { status });
  
  try {
    const { data } = await axios.put(`/api/growth/campaigns/${campaignId}/status`, { status });
    console.log('✅ [GROWTH API] Campaign status updated successfully');
    console.log('✅ [GROWTH API] Response data:', {
      id: data.id,
      name: data.name,
      status: data.status,
      updatedAt: data.updatedAt
    });
    return data;
  } catch (error: any) {
    console.error('❌ [GROWTH API] Error updating campaign status:', error);
    console.error('❌ [GROWTH API] Error details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.message,
      responseData: error.response?.data
    });
    throw error;
  }
};

// Discovered Brands API
export const getDiscoveredBrands = async (campaignId: string): Promise<DiscoveredBrand[]> => {
  console.log('🔍 [GROWTH API] Getting discovered brands...');
  console.log('🔍 [GROWTH API] Request URL:', `/api/growth/campaigns/${campaignId}/brands`);
  console.log('🔍 [GROWTH API] Request method: GET');
  console.log('🔍 [GROWTH API] Campaign ID:', campaignId);
  
  try {
    const { data } = await axios.get(`/api/growth/campaigns/${campaignId}/brands`);
    console.log('✅ [GROWTH API] Discovered brands retrieved successfully');
    console.log('✅ [GROWTH API] Response data:', {
      count: data.length,
      brands: data.map((brand: any) => ({
        id: brand.id,
        name: brand.name,
        status: brand.status,
        hasWebsite: !!brand.website,
        hasEmail: !!brand.email
      }))
    });
    return data;
  } catch (error: any) {
    console.error('❌ [GROWTH API] Error getting discovered brands:', error);
    console.error('❌ [GROWTH API] Error details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.message,
      responseData: error.response?.data
    });
    throw error;
  }
};

export const updateBrandStatus = async (
  brandId: string,
  status: DiscoveredBrand['status']
): Promise<DiscoveredBrand> => {
  console.log('🔄 [GROWTH API] Updating brand status...');
  console.log('🔄 [GROWTH API] Request URL:', `/api/growth/brands/${brandId}/status`);
  console.log('🔄 [GROWTH API] Request method: PUT');
  console.log('🔄 [GROWTH API] Request payload:', { status });
  
  try {
    const { data } = await axios.put(`/api/growth/brands/${brandId}/status`, { status });
    console.log('✅ [GROWTH API] Brand status updated successfully');
    console.log('✅ [GROWTH API] Response data:', {
      id: data.id,
      name: data.name,
      status: data.status,
      updatedAt: data.updatedAt
    });
    return data;
  } catch (error: any) {
    console.error('❌ [GROWTH API] Error updating brand status:', error);
    console.error('❌ [GROWTH API] Error details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.message,
      responseData: error.response?.data
    });
    throw error;
  }
};

// UPDATED: Use backend proxy endpoint instead of calling n8n directly
export const triggerPersonaGeneration = async (payload: {
  personaData: string;
}): Promise<{ message: string; status: string; tenantId: string }> => {
  console.log('🤖 [GROWTH API] Triggering persona generation...');
  console.log('🤖 [GROWTH API] Request URL:', '/api/growth/persona/generate');
  console.log('🤖 [GROWTH API] Request method: POST');
  console.log('🤖 [GROWTH API] Request payload:', {
    personaDataLength: payload.personaData.length,
    personaDataPreview: payload.personaData.substring(0, 100) + '...'
  });
  
  try {
    console.log('🤖 [GROWTH API] Making API call to backend proxy...');
    const { data } = await axios.post('/api/growth/persona/generate', payload);
    console.log('✅ [GROWTH API] Persona generation triggered successfully');
    console.log('✅ [GROWTH API] Response data:', {
      message: data.message,
      status: data.status,
      tenantId: data.tenantId
    });
    return data;
  } catch (error: any) {
    console.error('❌ [GROWTH API] Error triggering persona generation:', error);
    console.error('❌ [GROWTH API] Error details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.message,
      responseData: error.response?.data,
      requestPayload: payload
    });
    throw error;
  }
};

// Campaign Details API
export const getCampaignDetails = async (campaignId: string): Promise<GrowthCampaign> => {
  console.log('🔍 [GROWTH API] Getting campaign details...');
  console.log('🔍 [GROWTH API] Request URL:', `/api/growth/campaigns/${campaignId}`);
  console.log('🔍 [GROWTH API] Request method: GET');
  console.log('🔍 [GROWTH API] Campaign ID:', campaignId);
  
  try {
    const { data } = await axios.get(`/api/growth/campaigns/${campaignId}`);
    console.log('✅ [GROWTH API] Campaign details retrieved successfully');
    console.log('✅ [GROWTH API] Response data:', {
      id: data.id,
      name: data.name,
      status: data.status,
      keywordsCount: data.keywords?.length || 0,
      brandsCount: data.discoveredBrands?.length || 0
    });
    
    // 🔍 DEBUG: Console log suppliers data
    console.log('🔍 [GROWTH DEBUG] === SUPPLIERS DATA CHECK ===');
    if (data.discoveredBrands && data.discoveredBrands.length > 0) {
      data.discoveredBrands.forEach((brand: { companyName: any; status: any; discoveredSuppliers: any[]; }, index: number) => {
        console.log(`🔍 [GROWTH DEBUG] Brand ${index + 1}: ${brand.companyName}`, {
          status: brand.status,
          hasDiscoveredSuppliers: !!brand.discoveredSuppliers,
          suppliersCount: brand.discoveredSuppliers?.length || 0,
          suppliersData: brand.discoveredSuppliers || 'NOT_INCLUDED'
        });
        
        if (brand.discoveredSuppliers && brand.discoveredSuppliers.length > 0) {
          console.log(`🔍 [GROWTH DEBUG] Suppliers for ${brand.companyName}:`, 
            brand.discoveredSuppliers.map(s => ({
              id: s.id,
              name: s.companyName,
              country: s.country,
              relevance: s.relevanceScore
            }))
          );
        }
      });
    } else {
      console.log('🔍 [GROWTH DEBUG] No discoveredBrands found in response');
    }
    console.log('🔍 [GROWTH DEBUG] === END SUPPLIERS DATA CHECK ===');
    
    return data;
  } catch (error: any) {
    console.error('❌ [GROWTH API] Error getting campaign details:', error);
    console.error('❌ [GROWTH API] Error details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.message,
      responseData: error.response?.data
    });
    throw error;
  }
};

// Add supplier discovery functions at the end
export const findSuppliersForBrand = async (brandId: string): Promise<{ message: string }> => {
  console.log('🔍 [GROWTH API] Finding suppliers for brand...');
  console.log('🔍 [GROWTH API] Request URL:', `/api/growth/brands/${brandId}/find-suppliers`);
  console.log('🔍 [GROWTH API] Request method: POST');
  console.log('🔍 [GROWTH API] Brand ID:', brandId);
  
  try {
    const { data } = await axios.post(`/api/growth/brands/${brandId}/find-suppliers`);
    console.log('✅ [GROWTH API] Supplier discovery initiated successfully');
    console.log('✅ [GROWTH API] Response data:', {
      message: data.message
    });
    return data;
  } catch (error: any) {
    console.error('❌ [GROWTH API] Error finding suppliers for brand:', error);
    console.error('❌ [GROWTH API] Error details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.message,
      responseData: error.response?.data
    });
    throw error;
  }
};

export const getDiscoveredSuppliers = async (brandId: string): Promise<DiscoveredSupplier[]> => {
  console.log('🔍 [GROWTH API] Getting discovered suppliers...');
  console.log('🔍 [GROWTH API] Request URL:', `/api/growth/brands/${brandId}/suppliers`);
  console.log('🔍 [GROWTH API] Request method: GET');
  console.log('🔍 [GROWTH API] Brand ID:', brandId);
  
  try {
    const { data } = await axios.get(`/api/growth/brands/${brandId}/suppliers`);
    console.log('✅ [GROWTH API] Discovered suppliers retrieved successfully');
    console.log('✅ [GROWTH API] Response data:', {
      count: data.length,
      suppliers: data.map((supplier: any) => ({
        id: supplier.id,
        companyName: supplier.companyName,
        country: supplier.country,
        specialization: supplier.specialization,
        relevanceScore: supplier.relevanceScore
      }))
    });
    return data;
  } catch (error: any) {
    console.error('❌ [GROWTH API] Error getting discovered suppliers:', error);
    console.error('❌ [GROWTH API] Error details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.message,
      responseData: error.response?.data
    });
    throw error;
  }
};

export const getTargetContacts = async (supplierId: string): Promise<TargetContact[]> => {
  console.log('🔍 [GROWTH API] Getting target contacts...');
  console.log('🔍 [GROWTH API] Request URL:', `/api/growth/suppliers/${supplierId}/contacts`);
  console.log('🔍 [GROWTH API] Request method: GET');
  console.log('🔍 [GROWTH API] Supplier ID:', supplierId);
  
  try {
    const { data } = await axios.get(`/api/growth/suppliers/${supplierId}/contacts`);
    console.log('✅ [GROWTH API] Target contacts retrieved successfully');
    console.log('✅ [GROWTH API] Response data:', {
      count: data.length,
      contacts: data.map((contact: any) => ({
        id: contact.id,
        name: contact.name,
        title: contact.title,
        email: contact.email,
        hasLinkedin: !!contact.linkedinUrl
      }))
    });
    return data;
  } catch (error: any) {
    console.error('❌ [GROWTH API] Error getting target contacts:', error);
    console.error('❌ [GROWTH API] Error details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.message,
      responseData: error.response?.data
    });
    throw error;
  }
};

export const generateOutreachDraft = async (contactId: string): Promise<{ message: string; status: string }> => {
  console.log('✉️ [GROWTH API] Generating outreach draft...');
  console.log('✉️ [GROWTH API] Request URL:', `/api/growth/contacts/${contactId}/generate-draft`);
  console.log('✉️ [GROWTH API] Request method: POST');
  console.log('✉️ [GROWTH API] Contact ID:', contactId);
  
  try {
    const { data } = await axios.post(`/api/growth/contacts/${contactId}/generate-draft`);
    console.log('✅ [GROWTH API] Outreach draft generation initiated successfully');
    console.log('✅ [GROWTH API] Response data:', {
      message: data.message,
      status: data.status
    });
    return data;
  } catch (error: any) {
    console.error('❌ [GROWTH API] Error generating outreach draft:', error);
    console.error('❌ [GROWTH API] Error details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.message,
      responseData: error.response?.data
    });
    throw error;
  }
};

export interface OutreachEmail {
  id: string;
  subject: string;
  body: string;
  status: 'DRAFT' | 'QUEUED' | 'SENT' | 'FAILED' | 'REPLIED';
  serviceMessageId?: string;
  createdAt: string;
  updatedAt: string;
}

export const getOutreachEmails = async (contactId: string): Promise<{
  contactId: string;
  contactName: string;
  supplierName: string;
  outreachEmails: OutreachEmail[];
}> => {
  console.log('📧 [GROWTH API] Getting outreach emails...');
  console.log('📧 [GROWTH API] Request URL:', `/api/growth/contacts/${contactId}/outreach-emails`);
  console.log('📧 [GROWTH API] Request method: GET');
  console.log('📧 [GROWTH API] Contact ID:', contactId);
  
  try {
    const { data } = await axios.get(`/api/growth/contacts/${contactId}/outreach-emails`);
    console.log('✅ [GROWTH API] Outreach emails retrieved successfully');
    console.log('✅ [GROWTH API] Response data:', {
      contactId: data.contactId,
      contactName: data.contactName,
      supplierName: data.supplierName,
      emailCount: data.outreachEmails.length
    });
    return data;
  } catch (error: any) {
    console.error('❌ [GROWTH API] Error getting outreach emails:', error);
    console.error('❌ [GROWTH API] Error details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.message,
      responseData: error.response?.data
    });
    throw error;
  }
};

// =====================================================
// TASK MANAGEMENT API (Module 5 - Reply Processing)
// =====================================================

export interface GrowthTask {
  id: string;
  title: string;
  description?: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  taskType: 'REPLY_FOLLOWUP' | 'GENERAL';
  assignedUserId?: string;
  dueDate?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  
  // Reply-specific context
  originalEmailId?: string;
  contactId?: string;
  contactName?: string;
  contactEmail?: string;
  companyName?: string;
  campaignId?: string;
  campaignName?: string;
  replySubject?: string;
}

export interface TaskListResponse {
  tasks: GrowthTask[];
  totalCount: number;
  pendingCount: number;
  highPriorityCount: number;
}

export interface TaskCreateRequest {
  title: string;
  description?: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  taskType?: 'REPLY_FOLLOWUP' | 'GENERAL';
  dueDate?: string;
  contactId?: string;
}

export interface TaskUpdateRequest {
  title?: string;
  description?: string;
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';
  status?: 'TODO' | 'IN_PROGRESS' | 'DONE';
  dueDate?: string;
}

/**
 * Get all growth tasks with optional filtering
 */
export const getGrowthTasks = async (params?: {
  status?: 'TODO' | 'IN_PROGRESS' | 'DONE';
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';
  taskType?: 'REPLY_FOLLOWUP' | 'GENERAL';
  limit?: number;
  offset?: number;
}): Promise<TaskListResponse> => {
  console.log('📋 [GROWTH API] Getting growth tasks...');
  console.log('📋 [GROWTH API] Request params:', params);
  
  try {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.priority) queryParams.append('priority', params.priority);
    if (params?.taskType) queryParams.append('taskType', params.taskType);
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());
    
    const url = `/api/growth/tasks${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    console.log('📋 [GROWTH API] Request URL:', url);
    
    const { data } = await axios.get(url);
    console.log('✅ [GROWTH API] Tasks retrieved successfully');
    console.log('✅ [GROWTH API] Response:', {
      totalTasks: data.tasks?.length || 0,
      pendingCount: data.pendingCount,
      highPriorityCount: data.highPriorityCount
    });
    
    return data;
  } catch (error: any) {
    console.error('❌ [GROWTH API] Error getting growth tasks:', error);
    console.error('❌ [GROWTH API] Error details:', {
      status: error.response?.status,
      message: error.message,
      responseData: error.response?.data
    });
    throw error;
  }
};

/**
 * Get a specific growth task by ID
 */
export const getGrowthTask = async (taskId: string): Promise<GrowthTask> => {
  console.log('📋 [GROWTH API] Getting growth task by ID...');
  console.log('📋 [GROWTH API] Task ID:', taskId);
  
  try {
    const { data } = await axios.get(`/api/growth/tasks/${taskId}`);
    console.log('✅ [GROWTH API] Task retrieved successfully');
    console.log('✅ [GROWTH API] Task:', {
      id: data.id,
      title: data.title,
      priority: data.priority,
      status: data.status,
      taskType: data.taskType
    });
    
    return data;
  } catch (error: any) {
    console.error('❌ [GROWTH API] Error getting growth task:', error);
    throw error;
  }
};

/**
 * Create a new growth task
 */
export const createGrowthTask = async (task: TaskCreateRequest): Promise<GrowthTask> => {
  console.log('📋 [GROWTH API] Creating new growth task...');
  console.log('📋 [GROWTH API] Task data:', task);
  
  try {
    const { data } = await axios.post('/api/growth/tasks', task);
    console.log('✅ [GROWTH API] Task created successfully');
    console.log('✅ [GROWTH API] Created task:', {
      id: data.id,
      title: data.title,
      priority: data.priority,
      taskType: data.taskType
    });
    
    return data;
  } catch (error: any) {
    console.error('❌ [GROWTH API] Error creating growth task:', error);
    throw error;
  }
};

/**
 * Update an existing growth task
 */
export const updateGrowthTask = async (taskId: string, updates: TaskUpdateRequest): Promise<GrowthTask> => {
  console.log('📋 [GROWTH API] Updating growth task...');
  console.log('📋 [GROWTH API] Task ID:', taskId);
  console.log('📋 [GROWTH API] Updates:', updates);
  
  try {
    const { data } = await axios.put(`/api/growth/tasks/${taskId}`, updates);
    console.log('✅ [GROWTH API] Task updated successfully');
    console.log('✅ [GROWTH API] Updated task:', {
      id: data.id,
      title: data.title,
      status: data.status,
      priority: data.priority
    });
    
    return data;
  } catch (error: any) {
    console.error('❌ [GROWTH API] Error updating growth task:', error);
    throw error;
  }
};

/**
 * Delete a growth task
 */
export const deleteGrowthTask = async (taskId: string): Promise<{ message: string }> => {
  console.log('📋 [GROWTH API] Deleting growth task...');
  console.log('📋 [GROWTH API] Task ID:', taskId);
  
  try {
    const { data } = await axios.delete(`/api/growth/tasks/${taskId}`);
    console.log('✅ [GROWTH API] Task deleted successfully');
    console.log('✅ [GROWTH API] Response:', data.message);
    
    return data;
  } catch (error: any) {
    console.error('❌ [GROWTH API] Error deleting growth task:', error);
    throw error;
  }
};

/**
 * Get high-priority reply tasks (for dashboard alerts)
 */
export const getHighPriorityReplyTasks = async (): Promise<GrowthTask[]> => {
  console.log('🚨 [GROWTH API] Getting high-priority reply tasks...');
  
  try {
    const response = await getGrowthTasks({
      taskType: 'REPLY_FOLLOWUP',
      priority: 'HIGH',
      status: 'TODO',
      limit: 10
    });
    
    console.log('✅ [GROWTH API] High-priority reply tasks retrieved');
    console.log('✅ [GROWTH API] Count:', response.tasks.length);
    
    return response.tasks;
  } catch (error: any) {
    console.error('❌ [GROWTH API] Error getting high-priority reply tasks:', error);
    throw error;
  }
};

// =====================================================
// AI REPLY GENERATION API
// =====================================================

export interface AIReplyResponse {
  message: string;
  taskId: string;
  status: string;
  estimatedTime: string;
  context: {
    contactName: string;
    companyName: string;
    originalSubject: string;
  };
}

export interface AIDraftResponse {
  draftId: string;
  subject: string;
  body: string;
  createdAt: string;
  contact: {
    id: string;
    name: string;
    email: string;
    companyName: string;
  };
}

/**
 * Get AI-generated draft content for a task
 * @param taskId - Task ID to get AI draft for
 * @returns Promise with AI draft content
 */
export const getAIDraft = async (taskId: string): Promise<AIDraftResponse> => {
  console.log('📄 [GROWTH API] Getting AI draft...');
  console.log('📄 [GROWTH API] Task ID:', taskId);
  console.log('📄 [GROWTH API] Request URL:', `/api/growth/tasks/${taskId}/ai-draft`);
  console.log('📄 [GROWTH API] Request method: GET');
  
  try {
    const { data } = await axios.get(`/api/growth/tasks/${taskId}/ai-draft`);
    console.log('✅ [GROWTH API] AI draft retrieved successfully');
    console.log('✅ [GROWTH API] Response data:', {
      draftId: data.draftId,
      subject: data.subject,
      bodyLength: data.body?.length || 0,
      contactName: data.contact?.name,
      companyName: data.contact?.companyName,
      createdAt: data.createdAt
    });
    return data;
  } catch (error: any) {
    console.error('❌ [GROWTH API] Error getting AI draft:', error);
    console.error('❌ [GROWTH API] Error details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.message,
      responseData: error.response?.data
    });
    throw error;
  }
};

/**
 * Generate an AI-powered reply draft for a specific task (async)
 */
export const generateAIReply = async (taskId: string): Promise<AIReplyResponse> => {
  console.log('🚀 [GROWTH API] Triggering async AI reply generation for task:', taskId);
  
  try {
    const response = await axios.post<AIReplyResponse>(
      `/api/growth/tasks/${taskId}/generate-reply`
    );
    
    console.log('✅ [GROWTH API] AI reply generation triggered successfully');
    console.log('✅ [GROWTH API] Status:', response.data.status);
    console.log('✅ [GROWTH API] Estimated time:', response.data.estimatedTime);
    
    return response.data;
  } catch (error: any) {
    console.error('❌ [GROWTH API] Error triggering AI reply generation:', error);
    
    if (error.response?.status === 408) {
      throw new Error('AI reply generation timed out. Please try again.');
    } else if (error.response?.status === 400) {
      throw new Error('This feature is only available for reply follow-up tasks.');
    } else if (error.response?.status === 500 && error.response?.data?.message?.includes('not configured')) {
      throw new Error('AI reply generation is not configured. Please contact your administrator.');
    }
    
    throw error;
  }
};

export interface SendReplyResponse {
  message: string;
  status: string;
  emailId: string;
  subject: string;
  recipient: string;
  contactName: string;
  taskId: string;
  isResend: boolean;
}

/**
 * Send an AI-generated reply draft through the existing EmailSender workflow
 * @param taskId - Task ID associated with the reply
 * @returns Promise with send confirmation
 */
export const sendAIReply = async (taskId: string): Promise<SendReplyResponse> => {
  console.log('📤 [GROWTH API] Sending AI reply for task:', taskId);
  
  try {
    const response = await axios.post<SendReplyResponse>(
      `/api/growth/tasks/${taskId}/send-reply`
    );
    
    console.log('✅ [GROWTH API] AI reply sent successfully');
    console.log('✅ [GROWTH API] Response:', {
      status: response.data.status,
      emailId: response.data.emailId,
      subject: response.data.subject,
      recipient: response.data.recipient,
      contactName: response.data.contactName,
      taskId: response.data.taskId
    });
    
    return response.data;
  } catch (error: any) {
    console.error('❌ [GROWTH API] Error sending AI reply:', error);
    console.error('❌ [GROWTH API] Error details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.message,
      responseData: error.response?.data
    });
    
    if (error.response?.status === 404) {
      throw new Error('AI reply draft not found. Please generate a draft first.');
    } else if (error.response?.status === 400) {
      throw new Error(error.response?.data?.message || 'Invalid request. Please check the task status.');
    } else if (error.response?.status === 500) {
      throw new Error('Failed to send reply. Please try again or contact support.');
    }
    
    throw error;
  }
}; 