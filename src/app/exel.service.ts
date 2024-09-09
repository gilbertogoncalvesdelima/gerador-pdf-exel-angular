import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { PdfService } from './pdf.service';
import { ExcelService } from './excel.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  constructor(
    private excelService: ExcelService,
    private pdfService: PdfService
  ) {}

  async onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file && file.type === 'application/pdf') {
      const extractedText = await this.pdfService.extractTextFromPdf(file);
      console.log('Texto extraído:', extractedText);

      const dataForExcel = this.processExtractedData(extractedText);
      console.log('Dados processados:', dataForExcel);

      this.excelService.exportDataToExcel(dataForExcel, 'dados_extraidos');
    }
  }

  processExtractedData(extractedText: string): any[] {
    const linhas = extractedText.split('\n').map(linha => linha.trim()).filter(linha => linha.length > 0);
    const dados = [];
    let currentData: any = {};

    linhas.forEach((linha, index) => {
      if (linha.includes("Razão social") && index > 0) {
        // Push current data set and reset for the next entry
        if (Object.keys(currentData).length > 0) {
          dados.push(currentData);
          currentData = {};
        }
      }

      if (linha.includes("Razão social")) {
        currentData['Cliente'] = linhas[index + 1].trim();
      } else if (linha.includes("Designação")) {
        currentData['Designação'] = linha.split(':')[1]?.trim() || '';
      } else if (linha.includes("Produto")) {
        currentData['Produto'] = linha.split(':')[1]?.trim() || '';
      } else if (linha.includes("Ponta A")) {
        currentData['Endereço Ponta A'] = this.extractAddress(linhas, index + 1);
      } else if (linha.includes("Ponta B")) {
        currentData['Endereço Ponta B'] = this.extractAddress(linhas, index + 1);
      } else if (linha.includes("Velocidade")) {
        currentData['Velocidade'] = linha.split(':')[1]?.trim() || '';
      } else if (linha.includes("MRC")) {
        currentData['MRC'] = linha.split(':')[1]?.trim() || '';
      } else if (linha.includes("NRC")) {
        currentData['NRC'] = linha.split(':')[1]?.trim() || '';
      } else if (linha.includes("Prazo Contratual")) {
        currentData['Prazo Contratual'] = linha.split(':')[1]?.trim() || '';
      }
    });

    // Push the last data set
    if (Object.keys(currentData).length > 0) {
      dados.push(currentData);
    }

    return dados;
  }

  extractAddress(linhas: string[], startIndex: number): string {
    let address = '';
    for (let i = startIndex; i < linhas.length; i++) {
      if (linhas[i].includes("Telefone") || linhas[i].includes("Email")) {
        break;
      }
      address += linhas[i].trim() + ', ';
    }
    return address.slice(0, -2); // Remove the last comma and space
  }
}
