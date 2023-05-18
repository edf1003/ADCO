import { Injectable } from '@angular/core';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

@Injectable({
  providedIn: 'root',
})
export class ResumePdf {
  convertHTMLtoPDF(elementId: string, filename: string): void {
    const captureHTML = async (): Promise<string | null> => {
      const element = document.getElementById(elementId);

      if (element) {
        const canvas = await html2canvas(element);
        return canvas.toDataURL('image/png');
      }

      return null;
    };

    const createPDF = async (imageBase64: string): Promise<ArrayBuffer> => {
      const image = new Image();
      image.src = imageBase64;

      return new Promise((resolve) => {
        image.onload = () => {
          const aspectRatio = image.width / image.height;
          const width = image.width;
          const height = image.height;

          const margin = 20;
          const pageWidth = width + margin * 2;
          const pageHeight = height + margin * 2;

          const doc = new jsPDF({
            orientation: width > height ? 'landscape' : 'portrait',
            unit: 'px',
            format: [pageWidth, pageHeight],
          });

          doc.addImage(image, 'PNG', margin, margin, width, height);
          resolve(doc.output('arraybuffer'));
        };
      });
    };

    const downloadPDF = (pdfBytes: ArrayBuffer): void => {
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();

      URL.revokeObjectURL(url);
    };

    const convertAndDownloadPDF = async (): Promise<void> => {
      const imageBase64 = await captureHTML();

      if (imageBase64) {
        const pdfBytes = await createPDF(imageBase64);
        downloadPDF(pdfBytes);
      }
    };

    convertAndDownloadPDF();
  }
}
