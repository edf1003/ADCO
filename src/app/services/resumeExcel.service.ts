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
}
