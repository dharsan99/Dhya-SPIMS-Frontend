// src/components/PendingFibersCard.tsx
import Table from './Table';

interface FiberStock {
  date: string;
  supplier_name: string;
  type_name: string;
  sub_type_name: string;
  total_qty: number;
}

interface PendingFibersCardProps {
  data: FiberStock[];
}

const PendingFibersCard = ({ data }: PendingFibersCardProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow mb-8">
      <h3 className="text-lg font-semibold mb-4">Pending Fibers</h3>

      <Table
        headers={['Date', 'Supplier Name', 'Type Name', 'Sub-Type Name', 'Qty']}
        rows={data.map((fiber) => [
          fiber.date,
          fiber.supplier_name,
          fiber.type_name,
          fiber.sub_type_name,
          fiber.total_qty.toString(),
        ])}
      />
    </div>
  );
};

export default PendingFibersCard;