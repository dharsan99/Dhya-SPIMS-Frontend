// src/types/mailingList.ts
// src/types/mailingList.ts
export interface MailingList {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  
  // Link to Resend audience
  resendAudienceId?: string;
  
  // Link to existing buyers in our system
  mailingListBuyers: {
    buyerId: string;
    buyer: {
      id: string;
      name: string;
      email: string;
      company?: string;
      createdAt: string;
    };
  }[];
  
  // Resend audience information (populated by backend)
  resendAudience?: {
    id: string;
    contactCount: number;
    error?: boolean;
  };
  
  // Total contact count (Resend + our buyers)
  totalContactCount?: number;
}

// Add this interface to support recipient structure
export interface MailingListRecipient {
  name: string;
  email: string;
  company: string;
  source: 'buyer' | 'potential';
}

export interface MailingListContact {
  id: string;
  email: string;
  name: string;
  company: string;
  source: 'buyer' | 'resend' | 'potential';
  createdAt: string;
  isFromResend: boolean;
}

export interface MailingListContactsResponse {
  mailingList: MailingList;
  contacts: MailingListContact[];
  totalCount: number;
}
// 🔁 Updated DTO to support either buyers or recipients
export interface CreateMailingListDto {
  name: string;
  buyerIds?: string[]; // when source is 'buyer'
  recipients?: MailingListRecipient[]; // when source is 'potential'
}