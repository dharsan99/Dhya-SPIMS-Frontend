// src/components/ProductionSummaryCard.tsx
import Table from './Table';

interface ProductionRow {
  section: string;
  shift_1: number;
  shift_2: number;
  shift_3: number;
  total: number;
}

interface ProductionSummaryCardProps {
  data: ProductionRow[];
}

const ProductionSummaryCard = ({ data }: ProductionSummaryCardProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow mb-8">
      <h3 className="text-lg font-semibold mb-4">Daily Production Summary</h3>

      <Table
        headers={['Section', 'Shift 1', 'Shift 2', 'Shift 3', 'Total']}
        rows={data.map((row) => [
          row.section,
          row.shift_1.toString(),
          row.shift_2.toString(),
          row.shift_3.toString(),
          row.total.toString(),
        ])}
      />
    </div>
  );
};

export default ProductionSummaryCard;