import { Component } from "@angular/core";

@Component({
  selector: 'app-numberofvariables',
  templateUrl: './numberofvariables.component.html',
  styleUrls: ['./numberofvariables.component.scss'],
})

export class numberofvariables {

  valor: number = 0;

  guardarValor() {
    if(this.valor>=10){
      var alerta = document.getElementById('alert');
      if (alerta !== null){
        alerta.style.opacity = '100%';
      }
    } else {
      var alerta = document.getElementById('alert');
      if (alerta !== null){
        alerta.style.opacity = '0%';
      }
    }
  }








}

