// components/purchase-orders/Extractors.ts
import { getDocument } from 'pdfjs-dist';
import Tesseract from 'tesseract.js';

export const preprocessText = (raw: string): any => {
  const cleaned = raw
    .replace(/\s{2,}/g, ' ')      // Remove extra spaces
    .replace(/[\n\r]+/g, '\n')    // Normalize newlines
    .replace(/[|]+/g, '')         // Remove stray pipes
    .trim();

  const result: any = {};

  // 🧾 PO Number
  const poMatch = cleaned.match(/YARN\s*NO\.\s*[:\-]?\s*(.+)/i);
  if (poMatch) result.po_number = poMatch[1].trim();

  // 📅 PO Date
  const dateMatch = cleaned.match(/(?:PO\s+Date|Dated)\s*[:\-]?\s*([0-9\-\/]+)/i);
  if (dateMatch) result.po_date = dateMatch[1].trim();

  // 🏢 Buyer Name
 const buyerLine = cleaned.split('\n').find((line) => line.match(/^\s*To\s*[:\-]?\s*(.+)/i));
if (buyerLine) {
  const buyerMatch = buyerLine.match(/To\s*[:\-]?\s*(.+)/i);
  if (buyerMatch && buyerMatch[1].trim().length > 1) {
    result.buyer_name = buyerMatch[1].trim().replace(/^[:\-]+/, '');
  }
}

  // 📧 Email(s)
  const emails = cleaned.match(/[\w.-]+@[\w.-]+\.\w+/g);
  if (emails) result.buyer_email = emails[0]; // Assume first is buyer email

  // 🧾 GST/PAN
  const gstMatch = cleaned.match(/GST(?:\s*No\.?)?\s*[:\-]?\s*([0-9A-Z]{15})/i);
  if (gstMatch) result.supplier_gst_no = gstMatch[1];

  const panMatch = cleaned.match(/PAN(?:\s*No\.?)?\s*[:\-]?\s*([A-Z0-9]{10})/i);
  if (panMatch) result.buyer_pan_no = panMatch[1];

  // 🏠 Address
  const addressMatch = cleaned.match(/No\.?\s+\d{1,3}\/[^\n]+Bangalore/i);
  if (addressMatch) result.buyer_address = addressMatch[0].trim();

  // 💳 Payment Terms
  const paymentMatch = cleaned.match(/Payment\s+term[s]?\s*[:\-]?\s*(.+)/i);
  if (paymentMatch) result.payment_terms = paymentMatch[1].trim();

  // 📦 Style Reference No
  const styleRefMatch = cleaned.match(/Style\s*Ref(?:erence)?\s*No\.?\s*[:\-]?\s*(.+)/i);
  if (styleRefMatch) result.style_ref_no = styleRefMatch[1].trim();

  // 📦 Delivery Address
  const deliveryAddressMatch = cleaned.match(/Delivery\s+Address\s*[:\-]?\s*([^\n]+)/i);
  if (deliveryAddressMatch) result.delivery_address = deliveryAddressMatch[1].trim();

  // 📅 Delivery Date
  const deliveryDateMatch = cleaned.match(/DELIVERY\s+DATE\s*[:\-]?\s*([^\n]+)/i);
  if (deliveryDateMatch) result.delivery_date = deliveryDateMatch[1].trim();

  // 💰 Grand Total
  const grandTotalMatch = cleaned.match(/Net\s+Amount\s*[:\-]?\s*([\d,]+)/i);
  if (grandTotalMatch) result.total_amount = parseFloat(grandTotalMatch[1].replace(/,/g, ''));

  // 🧾 Amount in Words
  const wordsMatch = cleaned.match(/Rupees\s+([\w\s\-]+)\s+only/i);
  if (wordsMatch) result.amount_in_words = wordsMatch[1].trim();

  // 🧾 Tax Details
  const cgstMatch = cleaned.match(/CGST\s*[:\-]?\s*([\d.]+)/i);
  const sgstMatch = cleaned.match(/SGST\s*[:\-]?\s*([\d.]+)/i);
  const igstMatch = cleaned.match(/IGST\s*[:\-]?\s*([\d.]+)/i);

  result.tax_details = {
    cgst: cgstMatch ? parseFloat(cgstMatch[1]) : 0,
    sgst: sgstMatch ? parseFloat(sgstMatch[1]) : 0,
    igst: igstMatch ? parseFloat(igstMatch[1]) : 0,
  };

  // 📦 Extract Items (loop over lines)
  const items: any[] = [];
const itemLineRegex = /([A-Za-z \-]+)\s+SH\s*No\.?\s*(\d+)\s+(\d+)\s+([\d.]+)\s+([\d.]+)/gi;
  let match;
  while ((match = itemLineRegex.exec(cleaned)) !== null) {
    items.push({
      order_code: match[1] ?? '',
      color: match[2].trim(),
      shade_no: match[3],
      quantity: parseFloat(match[4]),
      rate: parseFloat(match[5]),
      taxable_amount: parseFloat(match[6]),
      uom: 'KGS',
      yarn_description: 'Combed Cotton',
      count: null,
      bag_count: null,
      gst_percent: null,
    });
  }

  result.items = items;

  // 🗒️ Remarks / Notes
  const remarkStart = cleaned.indexOf('Conditions / remarks');
  if (remarkStart !== -1) {
    const remarksSection = cleaned.substring(remarkStart).split('\n').slice(1, 10);
    result.notes = remarksSection.map(r => r.trim()).filter(Boolean).join('\n');
  }

  return result;
};

export const extractTextFromPDF = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await getDocument({ data: arrayBuffer }).promise;
  let fullText = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const text = content.items.map((item: any) => item.str).join(' ');
    fullText += `\n${text}`;
  }

  const cleaned = preprocessText(fullText.trim());
  return cleaned;
};

export const extractTextViaOCR = async (file: File): Promise<string> => {
  let fullText = '';

  const processImage = async (image: Blob | File) => {
    const result = await Tesseract.recognize(image, 'eng');
    return result.data.text;
  };

  if (file.type === 'application/pdf') {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await getDocument({ data: arrayBuffer }).promise;

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 2.0 });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) continue;

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({ canvasContext: context, viewport }).promise;
      const imageBlob = await new Promise<Blob>((resolve) =>
        canvas.toBlob((blob) => resolve(blob!), 'image/png')
      );

      fullText += await processImage(imageBlob);
    }
  } else {
    fullText = await processImage(file);
  }

  const cleaned = preprocessText(fullText.trim());
  return cleaned;
};