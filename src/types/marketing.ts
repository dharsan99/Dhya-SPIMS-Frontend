// src/types/marketing.ts

export interface EmailTemplate {
    id: string;
    name: string;
    subject: string;
    bodyHtml: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface EditableEmailTemplate {
    id?: string;
    name: string;
    subject: string;
    body: string;
  }
  
  // ✅ Add this for campaigns
  
  export interface Campaign {
    id: string;
    name: string;
    subject: string;
    bodyHtml: string;
    recipients: string[];
    createdAt: string;
    tenant_id: string;
    analytics?: {
      totalEvents: number;
      sent: number;
      delivered: number;
      opened: number;
      clicked: number;
      bounced: number;
      complained: number;
      uniqueRecipients: number;
    };
  }