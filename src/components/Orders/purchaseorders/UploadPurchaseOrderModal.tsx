import React, { useRef, useState, useEffect } from 'react';
import { getDocument, GlobalWorkerOptions, PDFDocumentProxy } from 'pdfjs-dist';
import { parsePurchaseOrder, createPurchaseOrder } from '../../../api/purchaseOrders';
import PurchaseOrderReviewForm, { PurchaseOrderFormValues } from './PurchaseOrderReviewForm';
import { TailwindDialog } from '../../ui/Dialog';
import Tesseract from 'tesseract.js';

GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js`;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onParsed: (data: any) => void;
}

const UploadPurchaseOrderModal: React.FC<Props> = ({ isOpen, onClose, onParsed }) => {
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<PurchaseOrderFormValues | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [, setPdfDoc] = useState<PDFDocumentProxy | null>(null);

  useEffect(() => {
    if (file) renderPDF(file);
  }, [file]);

  const extractTextViaOCR = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await getDocument({ data: arrayBuffer }).promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 2.0 });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d')!;
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({ canvasContext: context, viewport }).promise;

      const imageBlob = await new Promise<Blob>((resolve) =>
        canvas.toBlob((blob) => resolve(blob!), 'image/png')
      );

      const result = await Tesseract.recognize(imageBlob, 'eng', {
        logger: (m) => console.log(m),
      });

      fullText += result.data.text + '\n';
    }

    return fullText.trim();
  };

  const extractTextFromPDF = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await getDocument({ data: arrayBuffer }).promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const text = content.items.map((item: any) => item.str).join(' ');
      console.log(`📄 Page ${i} Text:`, text);
      fullText += `\n${text}`;
    }

    console.log("📝 Full Extracted Text:", fullText);
    return fullText.trim();
  };

  const renderPDF = async (file: File) => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await getDocument({ data: arrayBuffer }).promise;
    setPdfDoc(pdf);

    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 1.2 });
    const canvas = canvasRef.current;

    if (canvas) {
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: context!,
        viewport,
      };
      await page.render(renderContext).promise;
    }
  };

  const handleExtractAndParse = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    setFormData(null);

    try {
      const rawText = await extractTextFromPDF(file);

      if (!rawText.trim()) {
        console.warn("⚠️ PDF.js failed, trying OCR...");
        const ocrText = await extractTextViaOCR(file);
        console.log("🔍 OCR Extracted Text:", ocrText);
        const structured = await parsePurchaseOrder(ocrText);
        setFormData(structured);
      } else {
        const structured = await parsePurchaseOrder(rawText);
        setFormData(structured);
      }
    } catch (err) {
      console.error(err);
      setError('❌ Failed to extract and parse purchase order.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!formData) return;
    try {
      setLoading(true);
      const saved = await createPurchaseOrder(formData);
      alert('✅ Purchase Order created successfully');
      onParsed(saved);
      resetState();
    } catch (err: any) {
      alert(`❌ Failed to create: ${err.response?.data?.error || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const resetState = () => {
    setFile(null);
    setFormData(null);
    setError('');
    onClose();
  };

  return (
    <TailwindDialog
      isOpen={isOpen}
      onClose={resetState}
      title="AI-Powered Purchase Order Upload"
      maxWidth="max-w-6xl"
    >
      <div className="flex gap-6">
        {/* Left Panel: Upload / Parsed Data */}
        <div className="flex-1">
          {!formData ? (
            <>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="mb-4"
              />
              {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

              <div className="flex gap-2">
                <button
                  onClick={resetState}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleExtractAndParse}
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                  disabled={!file || loading}
                >
                  {loading ? 'Processing...' : 'Extract & Parse'}
                </button>
              </div>
            </>
          ) : (
            <>
              <PurchaseOrderReviewForm
                data={formData}
                onChange={setFormData}
                onCancel={resetState}
                onConfirm={handleConfirm}
              />
              <div className="flex justify-end gap-2 pt-4">
                <button
                  onClick={resetState}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  className="px-4 py-2 bg-green-600 text-white rounded"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Confirm & Save'}
                </button>
              </div>
            </>
          )}
        </div>

        {/* Right Panel: PDF Preview */}
        <div className="w-80 border rounded shadow p-2 bg-white">
          <h4 className="text-sm font-medium mb-2">PDF Preview</h4>
          {file ? (
            <canvas ref={canvasRef} className="w-full border" />
          ) : (
            <p className="text-gray-500 text-sm">Upload a PDF to preview.</p>
          )}
        </div>
      </div>
    </TailwindDialog>
  );
};

export default UploadPurchaseOrderModal;
