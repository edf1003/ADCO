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
      const doc = new jsPDF();
      const pdfWidth = doc.internal.pageSize.getWidth();
      const pdfHeight = doc.internal.pageSize.getHeight();
      const image = new Image();

      return new Promise((resolve) => {
        image.onload = () => {
          const aspectRatio = image.width / image.height;
          const maxWidth = pdfWidth - 40;
          const maxHeight = pdfHeight;
          let width = maxWidth;
          let height = maxWidth / aspectRatio;

          if (height > maxHeight) {
            height = maxHeight;
            width = height * aspectRatio;
          }

          const x = (pdfWidth - width) / 2;

          doc.addImage(image, 'PNG', x, 10, width, height);
          resolve(doc.output('arraybuffer'));
        };

        image.src = imageBase64;
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
