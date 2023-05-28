import { Component } from '@angular/core';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.scss'],
})
export class Data {
  valor: number = 0;

  constructor(public translationService: TranslationService) {}

  actualizarValor(nuevoValor: number) {
    this.valor = nuevoValor;
  }
}
