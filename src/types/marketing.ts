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
    recipients: any;
    id: string;
    name: string;
    subject: string;
    recipientsCount: number;
    createdAt?: string; // ✅ optional
  }