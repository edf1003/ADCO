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
      if (!element) return null;

      const canvas = await html2canvas(element);
      return canvas.toDataURL('image/png');
    };

    const createPDF = async (imageBase64: string): Promise<ArrayBuffer> => {
      const image = new Image();
      image.src = imageBase64;

      await new Promise((resolve) => {
        image.onload = resolve;
      });

      const { width, height } = image;
      const aspectRatio = width / height;
      const margin = 20;
      const pageWidth = width + margin * 2;
      const pageHeight = height + margin * 2;

      const doc = new jsPDF({
        orientation: width > height ? 'landscape' : 'portrait',
        unit: 'px',
        format: [pageWidth, pageHeight],
      });

      doc.addImage(image, 'PNG', margin, margin, width, height);
      return doc.output('arraybuffer');
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
      if (!imageBase64) return;

      const pdfBytes = await createPDF(imageBase64);
      downloadPDF(pdfBytes);
    };

    convertAndDownloadPDF();
  }
}
