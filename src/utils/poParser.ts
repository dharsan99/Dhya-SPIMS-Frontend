import { PurchaseOrderFormValues, PurchaseOrderItemFormValues } from '@/types/purchaseOrder';

class POParser {
  private text: string;

  constructor(text: string) {
    this.text = text;
  }

private match(regex: RegExp, fallback: string = ''): string {
  try {
    const match = this.text.match(regex);
    return match?.[1]?.trim() ?? fallback;
  } catch {
    return fallback;
  }
}

  private parseItems(): PurchaseOrderItemFormValues[] {
    const lines = this.text.split('\n');
    const items: PurchaseOrderItemFormValues[] = [];

    let currentDesc = '';
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (/^\d+%/.test(line) || /yarn/i.test(line) || /cotton/i.test(line)) {
        currentDesc += ' ' + line;
      }

      if (/^\d+\s*\|\s*\d+/.test(line) || /total/i.test(line)) {
        const qtyMatch = line.match(/(\d{2,})\s*\|\s*(\d{2,})/);
        const quantity = qtyMatch ? parseInt(qtyMatch[1]) : 0;
        const taxable = qtyMatch ? parseFloat(qtyMatch[2]) : 0;

        items.push({
          orderCode: '',
          yarnDescription: currentDesc.trim(),
          color: 'N/A',
          count: this.extractCount(currentDesc),
          uom: 'Kgs',
          bagCount: 0,
          quantity,
          rate: 0,
          gstPercent: 0,
          taxableAmount: taxable,
        });

        currentDesc = '';
      }
    }

    return items;
  }

  private extractCount(description: string): number {
    const countMatch = description.match(/(\d{2})\s?[sS]/);
    return countMatch ? parseInt(countMatch[1]) : 0;
  }

  public parse(): Partial<PurchaseOrderFormValues> {
    return {
      poNumber: this.match(/PO\s*No[:.\-]?\s*(\w+)/i),
      poDate: this.match(/Date[:.\-]?\s*(\d{2}\/\d{2}\/\d{4})/i),
      buyerName: this.match(/To[:.\-]?\s*([A-Z\s]+(?:LTD|LIMITED|EXPORTS)?)/i),
      buyerAddress: this.match(/DELIVERY\s*ADDRESS([\s\S]*?)GST/i).replace(/\n/g, ' ').trim(),
      buyerGstNo: this.match(/GST\s*No[:.\-]?\s*([A-Z0-9]+)/i),
      buyerEmail: this.match(/E[-]?mail[:.\-]?\s*(\S+@\S+)/i),
      buyerPhone: this.match(/Ph(?:one)?[:.\-]?\s*([0-9\s\-]+)/i),
      buyerPanNo: this.match(/PAN\s*No[:.\-]?\s*([A-Z0-9]+)/i),
      supplierName: this.match(/CANIMARA EXPORTS/i) ? 'CANIMARA EXPORTS' : '',
      supplierGstNo: this.match(/GST\s*No[:.\-]?\s*([A-Z0-9]+)/i),
      deliveryAddress: this.match(/DELIVERY\s*ADDRESS([\s\S]*?)\n/).replace(/\n/g, ' ').trim(),
      grandTotal: parseFloat(this.match(/Total[:.\-]?\s*(\d+)/i) || '0'),
      amountInWords: 'N/A',
      notes: this.match(/Notes[:.\-]?\s*(.*)/i) || '',
      paymentTerms: 'Standard',
      styleRefNo: '',
      items: this.parseItems()
    };
  }
}

// 🌟 Exported function to use
export const parsePurchaseOrderFromText = (text: string): Partial<PurchaseOrderFormValues> => {
  const parser = new POParser(text);
  return parser.parse();
};