import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { sendDataTable } from '../../services/sendDataTable.service';
import { Subscription } from 'rxjs';
import { PCA, PredictOptions } from "ml-pca";

@Component({
  selector: 'app-acp',
  templateUrl: './acp.component.html',
  styleUrls: ['./acp.component.scss']
})
export class AcpComponent  implements OnDestroy, OnInit {

  numberofnewlabels : number = 0;
  formulariodenumero: FormGroup;
  datosTabla: number[][] = [];
  dataset1: number[][] = [];
  dataset2: number[][] = [];
  private datosTablaSub: Subscription;
  twoLabels: boolean = false;
  sendIsPressed: boolean = false;
  isMayor: boolean = false;
  showPredictions: boolean = false;
  isOne: boolean = false;
  isTwo: boolean = false;

  //All PCA values
  pcaCumuVal:  any;
  pcaEigenValues:  any;
  pcaEigenVectors: any;
  pcaExplVar:  any;
  pcaLoad: any;
  pcaStandDev:  any;
  resultPCA: any;
  pcaInvert: any;


  constructor(private sendData: sendDataTable) {
    this.formulariodenumero = new FormGroup({});
    const control = new FormControl('');
    this.formulariodenumero.addControl("numberofnewlabels", control);
    this.datosTablaSub = this.sendData.getDatosTabla().subscribe(datos => {
      this.datosTabla = datos;
      });
    if (this.datosTabla.length === 2){
      this.twoLabels = true;
    }
  }


  ngOnDestroy() {
    this.datosTablaSub.unsubscribe();
  }

  ngOnInit(){
    this.formulariodenumero.controls['numberofnewlabels'].valueChanges.subscribe(() => {
      this.verificarCantidadLabels();
    });
  }


  verificarCantidadLabels() {
    const numberofnewlabels = this.formulariodenumero.controls['numberofnewlabels'].value;
    var boton = document.getElementById("submitButtom") as HTMLButtonElement;
    if (numberofnewlabels >= this.datosTabla.length) {
      boton.disabled = true;
      this.isMayor = true;
    } else {
      boton.disabled = false;
      this.isMayor = false;
    }
  }

  setnumberofnewlabels(){
    this.numberofnewlabels = this.formulariodenumero.get("numberofnewlabels")?.value;
    this.sendIsPressed = true;
    var pca = new PCA(this.datosTabla);
    this.pcaCumuVal = pca.getCumulativeVariance();
    this.pcaEigenValues = pca.getEigenvalues();
    this.pcaEigenVectors = pca.getEigenvectors().to2DArray();
    this.pcaExplVar = pca.getExplainedVariance();
    this.pcaLoad = pca.getLoadings().to2DArray();
    this.pcaStandDev = pca.getStandardDeviations();
    this.resultPCA = pca.predict(this.datosTabla).to2DArray();

    if(this.datosTabla[0].length===2){
      this.twoLabels = true;
    }

    if(this.numberofnewlabels === 2){
      this.isTwo = true;
      this.isOne = false;
      for (var i = 0; i< this.datosTabla.length; i++) {
        this.dataset2.push([this.resultPCA[i][0],this.resultPCA[i][1]]);
      }
    } else if(this.numberofnewlabels === 1){
      this.isTwo = false;
      this.isOne = true;
      for (var i = 0; i< this.datosTabla.length; i++) {
        this.dataset1.push([this.resultPCA[i][0],0]);
      }
    } else {
      this.isTwo = false;
      this.isOne = false;
      for (var i = 0; i< this.datosTabla.length; i++) {
        this.dataset1.push([this.resultPCA[i][0],0]);
      }
    }
  }

  showPredictionsFun(){
    this.showPredictions = !this.showPredictions;
  }
}
