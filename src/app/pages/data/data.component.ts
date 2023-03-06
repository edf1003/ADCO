import { Component } from "@angular/core";

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.scss'],
})

export class data {

  valor: number = 0;

  actualizarValor(nuevoValor: number) {
    this.valor = nuevoValor;
  }

}

