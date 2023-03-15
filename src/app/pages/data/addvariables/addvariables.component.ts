import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { sendDataTable } from '../../../services/sendDataTable.service';
import * as XLSX from 'xlsx';

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
  optionFileBool: boolean = false;
  optionManualBool: boolean = false;

  cabeceraTabla: Array<string> = [];
  datosTabla: Array<Array<any>> = []; //Array de objetros paquetededatos
  paquetedatos: string[] = []; //Array de datos de una fila

  constructor(private sendData: sendDataTable) {
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
        this.optionFileBool = false;
        this.optionManualBool = !this.optionFileBool;
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

  sendDatos(){
    this.sendData.setDatosTabla(this.datosTabla);
    window.alert("Ya puedes acceder a ACP.")
  }

  onFileSelected(event: any): void {
    let archivo = event.target.files[0];
    let lector = new FileReader();
    lector.onload = (e: any) => {
      let datos = new Uint8Array(e.target.result);
      let libro = XLSX.read(datos, { type: 'array' });
      let hoja = libro.Sheets[libro.SheetNames[0]];
      let json = XLSX.utils.sheet_to_json(hoja, { header: 1 });
      this.cabeceraTabla = json[0] as Array<string>;
      this.datosTabla = json.slice(1) as Array<Array<any>>;
      this.valor = this.cabeceraTabla.length;
      this.optionFileBool = true;
      this.optionManualBool = !this.optionFileBool;
    };
    lector.readAsArrayBuffer(archivo);
  }
}
