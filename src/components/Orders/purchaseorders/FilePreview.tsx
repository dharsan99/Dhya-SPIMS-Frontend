// components/purchase-orders/FilePreview.tsx
import React, { useEffect } from 'react';
import { getDocument, GlobalWorkerOptions, PDFDocumentProxy } from 'pdfjs-dist';
import type { RenderTask } from 'pdfjs-dist';

GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js`;
let currentRenderTask: RenderTask | null = null;

interface Props {
  file: File;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  onLoaded: (doc: PDFDocumentProxy) => void;
}

const FilePreview: React.FC<Props> = ({ file, canvasRef, onLoaded }) => {
  useEffect(() => {
    const renderPDF = async (file: File) => {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await getDocument({ data: arrayBuffer }).promise;
      onLoaded(pdf); // notify parent
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 1.2 });
      const canvas = canvasRef.current;

      if (canvas) {
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // Cancel previous render if still running
        if (currentRenderTask) {
          currentRenderTask.cancel();
        }

        // Start new render
        const renderContext = {
          canvasContext: context!,
          viewport,
        };

        currentRenderTask = page.render(renderContext);
        try {
          await currentRenderTask.promise;
        } catch (err: any) {
          if (err?.name === 'RenderingCancelledException') {
            console.warn('Previous render cancelled');
          } else {
            console.error('Render error:', err);
            throw err;
          }
        }
      }
    };

    if (file.type === 'application/pdf') {
      renderPDF(file);
    }
  }, [file, canvasRef, onLoaded]);

  if (file.type.startsWith('image/')) {
    return (
      <img
        src={URL.createObjectURL(file)}
        alt="Preview"
        className="w-full border object-contain"
      />
    );
  }

  return <canvas ref={canvasRef} className="w-full border" />;
};

export default FilePreview;