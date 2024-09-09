import { Injectable } from '@angular/core';
import * as pdfjsLib from 'pdfjs-dist';
//import pdfjsWorker from 'pdfjs-dist/build';

// Importe o worker manualmente ou use o caminho relativo
(
  pdfjsLib as any
).GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.5.136/pdf.worker.min.mjs`;

//cdnjs.com/libraries/pdf.js
@Injectable({
  providedIn: 'root',
})
export class PdfService {
  async extractTextFromPdf(pdfFile: File): Promise<string> {
    const pdfData = await pdfFile.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
    let text = '';

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      textContent.items.forEach((item: any) => {
        text += item.str + ' ';
      });
    }

    return text;
  }
}
