// src/types/mailingList.ts
export interface MailingList {
  id: string;
  name: string;
  mailingListBuyers: {
    buyerId: string;
    buyer: {
      name: string;
      email: string;
    };
  }[];
  mailingListRecipients: MailingListRecipient[]; // ✅ ADD THIS LINE
}

// Add this interface to support recipient structure
export interface MailingListRecipient {
  name: string;
  email: string;
  company: string;
  source: 'buyer' | 'potential';
}

// 🔁 Updated DTO to support either buyers or recipients
export interface CreateMailingListDto {
  name: string;
  buyerIds?: string[]; // when source is 'buyer'
  recipients?: MailingListRecipient[]; // when source is 'potential'
}