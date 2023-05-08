import * as XLSX from 'xlsx';

class ExcelService {
  private workbook: XLSX.WorkBook;

  constructor() {
    this.workbook = XLSX.utils.book_new();
  }

  public addData(sheetName: string, data: any[][]): void {
    const worksheet = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(this.workbook, worksheet, sheetName);
  }

  public saveToFile(fileName: string): void {
    XLSX.writeFile(this.workbook, fileName);
  }
}
