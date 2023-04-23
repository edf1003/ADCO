import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PCAdata {
  private PCAdataSubject = new BehaviorSubject<number[][]>([]);

  setDatosTabla(data: number[][]) {
    this.PCAdataSubject.next(data);
  }

  getDatosTabla() {
    return this.PCAdataSubject.asObservable();
  }

}
