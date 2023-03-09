import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-addvariables',
  templateUrl: './addvariables.component.html',
  styleUrls: ['./addvariables.component.scss']
})
export class AddvariablesComponent implements OnChanges {

  @Input() valor: number = 0;
  inputsArray: any[] = new Array(this.valor); //Array para poder iterar sobre un numero "valor" de labels.

  formulariodecabeceras: FormGroup;
  formulariodedatos: FormGroup;

  buttonPush: boolean = false;
  isdisabledlabels: boolean = false;
  anydataisempty: boolean = false;
  disabledbuttonend: boolean = true;

  cabeceraTabla: string[] = [];
  datosTabla: string[][] = []; //Array de objetros paquetededatos
  paquetedatos: string[] = []; //Array de datos de una fila

  constructor() {
    this.formulariodecabeceras = new FormGroup({});
    this.formulariodedatos = new FormGroup({});
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.valor){
      if (this.valor<10){
        this.inputsArray = new Array(this.valor);
        for (let i = 0;i < this.valor; i++) {
          const control = new FormControl('');
          this.formulariodecabeceras.addControl("label" + i, control);
          const controldata = new FormControl('',  Validators.compose([Validators.required, Validators.min(1)]));
          this.formulariodedatos.addControl("data" + i, controldata );
        }
      }
      else{
        this.valor = 0
        this.inputsArray = new Array(0);
      }
    }
  }

  creartabla(){
    this.buttonPush = true;
    for (let i = 0;i < this.valor; i++) {
      if(this.formulariodecabeceras.get("label" + i)?.enabled){
        this.cabeceraTabla.push(this.formulariodecabeceras.get("label" + i)?.value);
        this.formulariodecabeceras.get("label" + i)?.disable()
      }
    }
    this.isdisabledlabels = true;

  }

  setdata(){
    this.paquetedatos = []
    this.anydataisempty = false;
    for (let i = 0;i < this.valor; i++) {
      this.paquetedatos.push(this.formulariodedatos.get("data" + i)?.value);
      if(this.formulariodedatos.get("data" + i)?.value === ""){
        this.anydataisempty = true
        var alerta = document.getElementById('alert2');
        if (alerta !== null){
          alerta.style.opacity = '100%';
        }
      }
      this.formulariodedatos.get("data" + i)?.setValue("");
      this.disabledbuttonend = false;
    }
    if(this.anydataisempty === false){
      this.datosTabla.push(this.paquetedatos)
      var alerta = document.getElementById('alert2');
        if (alerta !== null){
          alerta.style.opacity = '0%';
        }
    }
  }

  deletecolumn(index: number){
    this.datosTabla.splice(index,1);
  }

  editcolumn(index: number){
    this.datosTabla[index];
    window.alert("Future Feature.")
  }

}
