import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root',
})
export class ResumeExcel {
  private workbook: XLSX.WorkBook;

  constructor() {
    this.workbook = XLSX.utils.book_new();
  }

  clearExcel() {
    this.workbook = XLSX.utils.book_new();
  }

  addData(sheetName: string, data: any[][]): void {
    const worksheet = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(this.workbook, worksheet, sheetName);
  }

  addLineToSheet(sheetName: string, sheetData: any[]): void {
    const data = this.transformArray(sheetData);
    const worksheet = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(this.workbook, worksheet, sheetName);
  }

  transformArray(array: any[]): any[][] {
    return array.map((item) => [item]);
  }

  saveToFile(): void {
    XLSX.writeFile(this.workbook, 'Resultados.xlsx');
  }

  downloadACP() {
    this.workbook = XLSX.utils.book_new();
    this.addData('EjemploACP', [
      [
        'Ingresos anuales (miles)',
        'gastos anuales (miles)',
        'Numero de empleados',
        'Nivel de satisfaccion',
      ],
      [120, 85, 10, 8],
      [90, 60, 8, 6],
      [150, 120, 15, 9],
      [75, 55, 7, 5],
      [110, 95, 9, 7],
    ]);
    XLSX.writeFile(this.workbook, 'EjemploACP.xlsx');
    this.clearExcel();
  }

  downloadClustering() {
    this.workbook = XLSX.utils.book_new();
    this.addData('EjemploClustering', [
      ['Ingresos mensuales (miles)', 'Gastos mensuales (miles)'],
      [12.5, 8.3],
      [10.2, 6.5],
      [15.6, 9.2],
      [8.9, 5.1],
      [11.3, 7.2],
      [9.7, 6.8],
      [14.2, 8.9],
      [13.1, 7.5],
      [10.8, 6.4],
      [12.3, 7.8],
    ]);
    XLSX.writeFile(this.workbook, 'EjemploClustering.xlsx');
    this.clearExcel();
  }
}
