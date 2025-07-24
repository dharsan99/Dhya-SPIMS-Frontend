export interface EmailEvent {
  id: string;
  emailId: string;
  campaignId?: string;
  recipient: string;
  eventType: EmailEventType;
  eventData?: any;
  createdAt: string;
  campaign?: {
    id: string;
    name: string;
    subject: string;
  };
}

export type EmailEventType = 
  | 'SENT'
  | 'DELIVERED'
  | 'DELIVERY_DELAYED'
  | 'COMPLAINED'
  | 'BOUNCED'
  | 'OPENED'
  | 'CLICKED';

export interface BouncedEmail {
  id: string;
  email: string;
  bounceType: BounceType;
  bounceMessage?: string;
  lastBounced: string;
  createdAt: string;
  updatedAt: string;
}

export type BounceType = 'HARD' | 'SOFT' | 'SUPPRESSED';

export interface EmailAnalytics {
  period: string;
  totalEvents: number;
  uniqueRecipients: number;
  bounceCount: number;
  eventBreakdown: {
    [key in EmailEventType]?: number;
  };
}

export interface CampaignAnalytics {
  totalEvents: number;
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  bounced: number;
  complained: number;
  uniqueRecipients: number;
  deliveryRate: string;
  openRate: string;
  clickRate: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
} 