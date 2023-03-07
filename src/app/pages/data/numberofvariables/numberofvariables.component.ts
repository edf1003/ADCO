import { Component, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: 'app-numberofvariables',
  templateUrl: './numberofvariables.component.html',
  styleUrls: ['./numberofvariables.component.scss'],
})

export class numberofvariables {

  @Input() valor: number = 0;
  @Output() valorActualizado = new EventEmitter<number>();

  constructor() {}

  guardarValor() {
    if(this.valor>=10){
      var alerta = document.getElementById('alert');
      if (alerta !== null){
        alerta.style.opacity = '100%';
        this.valor = 0;
        this.valorActualizado.emit(this.valor);
      }
    } else {
      var alerta = document.getElementById('alert');
      if (alerta !== null){
        alerta.style.opacity = '0%';
        this.valorActualizado.emit(this.valor);
        var boton = document.getElementById('botonGuardar') as HTMLButtonElement;
        boton.disabled = true;
      }
    }
  }








}

