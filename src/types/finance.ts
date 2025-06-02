export interface FinanceRow {
    type: 'Receivable' | 'Payable';
    party_name: string;
    amount: number;
    due_date: string;
    status: 'due' | 'paid' | 'overdue';
  }