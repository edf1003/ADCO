import { Component, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { sendDataTable } from '../../../services/sendDataTable.service';
import * as XLSX from 'xlsx';
import { PCA } from 'ml-pca';

@Component({
  selector: 'app-addvariables',
  templateUrl: './addvariables.component.html',
  styleUrls: ['./addvariables.component.scss']
})
export class AddvariablesComponent {

  valor: number = 0;
  inputsArray: any[] = new Array(this.valor); //Array para poder iterar sobre un numero "valor" de labels.

  formulariodecabeceras: FormGroup;
  formulariodedatos: FormGroup;

  buttonPush: boolean = false;
  isdisabledlabels: boolean = false;
  anydataisempty: boolean = false;
  optionFileBool: boolean = false;
  optionManualBool: boolean = false;
  disabledinput: boolean = false;
  isFirstTime: boolean = true;
  isStandarized: boolean = false;

  cabeceraTabla: Array<string> = [];
  datosTabla: Array<Array<any>> = [];
  datosReset: Array<Array<any>> = []; //Array de objetros paquetededatos
  paquetedatos: string[] = []; //Array de datos de una fila
  pcaStandDev:  Array<Array<number>> = [];

  constructor(private sendData: sendDataTable) {
    this.formulariodecabeceras = new FormGroup({});
    this.formulariodedatos = new FormGroup({});
  }

  guardarValor() {
    if(this.valor>=10 || this.valor <= 0 || !this.valor ){
      var alerta = document.getElementById('alert');
      if (alerta !== null){
        alerta.style.opacity = '100%';
        this.valor = 0;

      }
    } else {
      var alerta = document.getElementById('alert');
      if (alerta !== null){
        alerta.style.opacity = '0%';
        this.disabledinput = true;
      }
      this.generarLabels();
    }
  }

  generarLabels() {
    if(this.valor){
      if (this.valor<10){
        this.inputsArray = new Array(this.valor);
        for (let i = 0;i < this.valor; i++) {
          const control = new FormControl('');
          this.formulariodecabeceras.addControl("label" + i, control);
          const controldata = new FormControl('',  Validators.compose([Validators.required, Validators.min(1)]));
          this.formulariodedatos.addControl("data" + i, controldata );
        }
        this.optionFileBool = false;
        this.optionManualBool = !this.optionFileBool;
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

  sendDatos(){
    if (!this.isStandarized){
      this.sendData.setDatosTabla(this.datosTabla);
    }
    else {
      this.sendData.setDatosTabla(this.pcaStandDev);
    }
  }

  resetDatos(){
    this.datosTabla = [];
    for (let e of this.datosReset){
      this.datosTabla.push(e);
    }
  }

  setDatosReset() {
    if (this.isFirstTime === true){
      for (let e of this.datosTabla){
        this.datosReset.push(e);
      }
      this.isFirstTime = false;
    }
  }

  onFileSelected(event: any): void {
    let archivo = event.target.files[0];
    let lector = new FileReader();
    this.isFirstTime = true;
    this.datosReset = [];
    lector.onload = (e: any) => {
      let datos = new Uint8Array(e.target.result);
      let libro = XLSX.read(datos, { type: 'array' });
      let hoja = libro.Sheets[libro.SheetNames[0]];
      let json = XLSX.utils.sheet_to_json(hoja, { header: 1 });
      this.cabeceraTabla = json[0] as Array<string>;
      this.datosTabla = json.slice(1) as Array<Array<any>>;
      this.setDatosReset();
      this.valor = this.cabeceraTabla.length;
      this.optionFileBool = true;
      this.optionManualBool = !this.optionFileBool;
    };
    lector.readAsArrayBuffer(archivo);
  }

  standarizeDataTable() {
    const nFilas = this.datosTabla.length;
    const nColumnas = this.datosTabla[0].length;
    const medias = Array<number>(nColumnas).fill(0);
    const desviaciones = Array<number>(nColumnas).fill(0);

    // Calcular la media de cada columna
    for (let j = 0; j < nColumnas; j++) {
      let suma = 0;
      for (let i = 0; i < nFilas; i++) {
        suma += this.datosTabla[i][j];
      }
      medias[j] = suma / nFilas;
    }

    // Calcular la desviación estándar de cada columna
    for (let j = 0; j < nColumnas; j++) {
      let suma = 0;
      for (let i = 0; i < nFilas; i++) {
        suma += Math.pow((this.datosTabla[i][j] - medias[j]), 2);
      }
      desviaciones[j] = Math.sqrt(suma / nFilas);
    }

    // Crear una nueva matriz para almacenar los datos estandarizados
    this.pcaStandDev = new Array<Array<number>>();
    for (let i = 0; i < nFilas; i++) {
      this.pcaStandDev[i] = new Array<number>();
    }

    // Estandarizar los datos y agregarlos a la nueva matriz
    for (let i = 0; i < nFilas; i++) {
      for (let j = 0; j < nColumnas; j++) {
        this.pcaStandDev[i][j] = (this.datosTabla[i][j] - medias[j]) / desviaciones[j];
      }
    }
      this.isStandarized = !this.isStandarized;
    }
}
