import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class sendDataTable {
  private datosTablaSubject = new BehaviorSubject<string[][]>([]);

  setDatosTabla(datos: string[][]) {
    this.datosTablaSubject.next(datos);
  }

  getDatosTabla() {
    return this.datosTablaSubject.asObservable();
  }

}
