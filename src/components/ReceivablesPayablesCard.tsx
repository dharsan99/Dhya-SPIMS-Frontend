// src/components/ReceivablesPayablesCard.tsx
import Table from './Table';

interface FinanceRow {
  type: 'Receivable' | 'Payable';
  party_name: string;
  amount: number;
  due_date: string;
  status: 'due' | 'paid' | 'overdue';
}

interface ReceivablesPayablesCardProps {
  data: FinanceRow[];
}

const ReceivablesPayablesCard = ({ data }: ReceivablesPayablesCardProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow mb-8">
      <h3 className="text-lg font-semibold mb-4">Outstanding Receivables / Payables</h3>

      <Table
        headers={['Type', 'Party Name', 'Amount', 'Due Date', 'Status']}
        rows={data.map((row) => [
          row.type,
          row.party_name,
          `₹${row.amount.toLocaleString()}`,
          row.due_date,
          row.status,
        ])}
      />
    </div>
  );
};

export default ReceivablesPayablesCard;