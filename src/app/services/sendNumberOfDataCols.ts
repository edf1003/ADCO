import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  numero: number = 0;

  setValor(numero: number) {
    this.numero = numero;
  }

  getValor() {
    return this.numero;
  }
}
