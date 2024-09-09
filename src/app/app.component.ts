import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { PdfService } from './pdf.service';
import { ExcelService } from './exel.service';

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
      console.log(extractedText);  // Verifique o conteúdo extraído no console

      const dataForExcel = this.processExtractedData(extractedText);
      console.log(dataForExcel);  // Verifique se os dados estão sendo processados corretamente

      this.excelService.exportDataToExcel(dataForExcel, 'dados_extraidos');
    }
  }

  processExtractedData(extractedText: string): any[] {
    const linhas = extractedText.split('\n');

    const dados = [];

    for (let i = 0; i < linhas.length; i++) {
      const linha = linhas[i].trim();
      if (linha.startsWith("TIM")) {
        const razaoSocial = linha;
        const endereco = linhas[i + 1].trim();
        const cidade = linhas[i + 2].trim().split(/\s+/)[0];
        const cep = linhas[i + 2].trim().split(/\s+/)[1];
        const uf = linhas[i + 2].trim().split(/\s+/)[2];
        const cnpj = linhas[i + 3].trim().split(/\s+/)[0];
        const inscEst = linhas[i + 3].trim().split(/\s+/)[1];
        const inscMunicipal = linhas[i + 3].trim().split(/\s+/)[2];
        const telefone = linhas[i + 4].trim().split(/\s+/).slice(0, 3).join(' ');
        const email = linhas[i + 4].trim().split(/\s+/).slice(3).join(' ');

        dados.push({
          'Razão Social': razaoSocial,
          'Endereço': endereco,
          'Cidade': cidade,
          'CEP': cep,
          'UF': uf,
          'CNPJ': cnpj,
          'Insc Est': inscEst,
          'Insc Municipal': inscMunicipal,
          'Telefone': telefone,
          'Email': email
        });
      }
    }

    return dados;
  }

}
