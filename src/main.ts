import { AfterViewInit, Component, OnInit } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouterModule } from '@angular/router'; // Importe o RouterModule
import { PdfService } from './app/pdf.service';
import { ExcelService } from './app/exel.service'; // Corrigido o nome do serviço para ExcelService

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app/app.component.html',
  imports: [RouterModule], // Adicione RouterModule aqui
})
export class App implements OnInit, AfterViewInit {
  teste: any;
  constructor(
    private excelService: ExcelService,
    private pdfService: PdfService
  ) {}

  ngOnInit() {
    console.log(this.teste);
  }

  ngAfterViewInit() {
    console.log(this.teste);
  }

  async onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file && file.type === 'application/pdf') {
      const extractedText = await this.pdfService.extractTextFromPdf(file);

      // Supondo que você converta o texto extraído em um array de objetos para Excel
      const dataForExcel = this.processExtractedData(extractedText);

      this.excelService.exportDataToExcel(dataForExcel, 'dados_extraidos');
      this.teste = dataForExcel;
    }
  }

  processExtractedData(extractedText: any): any[] {
    // Lógica para transformar o texto em uma estrutura de dados apropriada
    const data = extractedText.split('\n').map((line: any) => {
      const columns = line.split(' ');
      return {
        coluna1: columns[0],
        coluna2: columns[1],
        coluna3: columns[2],
        // etc...
      };
    });

    return data;
  }
}

bootstrapApplication(App);
