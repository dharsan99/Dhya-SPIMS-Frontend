import * as XLSX from 'xlsx';

export function exportOrdersToExcel(orders: any[], filename = 'orders.xlsx') {
  if (!orders || orders.length === 0) return;

  // Map orders to flat objects for export (customize columns as needed)
  const data = orders.map(order => ({
    'PO Number': order.po_number || order.order_number || '',
    'PO Date': order.po_date || order.order_date || '',
    'Delivery': order.delivery_date || '',
    'Buyer': order.buyer_name || order.buyer?.name || '',
    'Shade': order.shade_code || order.shade?.shade_code || '',
    'Count': order.items?.[0]?.count || order.count || '',
    'Quantity': order.items?.[0]?.quantity || order.quantity_kg || '',
    'Status': order.status || '',
    // Add more columns as needed
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders');
  XLSX.writeFile(workbook, filename);
} 