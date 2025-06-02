import { StockItem } from '@/types/stock';
import { v4 as uuidv4 } from 'uuid';



export const mockStockData: StockItem[] = [
  {
    id: uuidv4(),
    fibre_name: 'Cotton A',
    category: 'Cotton',
    stock_kg: 1200,
    threshold_kg: 500,
    last_updated: '2025-05-31',
  },
  {
    id: uuidv4(),
    fibre_name: 'Polyester B',
    category: 'Synthetic',
    stock_kg: 800,
    threshold_kg: 300,
    last_updated: '2025-05-30',
  },
  {
    id: uuidv4(),
    fibre_name: 'Viscose C',
    category: 'Semi-Synthetic',
    stock_kg: 100,
    threshold_kg: 200,
    last_updated: '2025-05-29',
  },
  {
    id: uuidv4(),
    fibre_name: 'Linen D',
    category: 'Natural',
    stock_kg: 450,
    threshold_kg: 400,
    last_updated: '2025-05-28',
  },
  {
    id: uuidv4(),
    fibre_name: 'Wool E',
    category: 'Animal',
    stock_kg: 950,
    threshold_kg: 600,
    last_updated: '2025-05-27',
  },
  {
    id: uuidv4(),
    fibre_name: 'Nylon F',
    category: 'Synthetic',
    stock_kg: 320,
    threshold_kg: 350,
    last_updated: '2025-05-26',
  },
  {
    id: uuidv4(),
    fibre_name: 'Silk G',
    category: 'Animal',
    stock_kg: 210,
    threshold_kg: 150,
    last_updated: '2025-05-25',
  },
  {
    id: uuidv4(),
    fibre_name: 'Acrylic H',
    category: 'Synthetic',
    stock_kg: 600,
    threshold_kg: 400,
    last_updated: '2025-05-24',
  },
  {
    id: uuidv4(),
    fibre_name: 'Hemp I',
    category: 'Natural',
    stock_kg: 180,
    threshold_kg: 200,
    last_updated: '2025-05-23',
  },
  {
    id: uuidv4(),
    fibre_name: 'Modal J',
    category: 'Semi-Synthetic',
    stock_kg: 750,
    threshold_kg: 500,
    last_updated: '2025-05-22',
  },
];