export interface ReceivablePayable {
    party_name: string;
    amount: number;
    due_date: string;
    type: 'receivable' | 'payable';
  }

  