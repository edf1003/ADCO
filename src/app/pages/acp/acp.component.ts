import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { sendDataTable } from '../../services/sendDataTable.service';
import { Subscription } from 'rxjs';
import { PCA, PredictOptions, PCAOptions } from "ml-pca";
import { data } from '../data/data.component';

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
  dataset1Stand: number[][] = [];
  dataset2Stand: number[][] = [];
  standarizedDataset: number[][] = [];
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
  resultPCAStand: any;


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
      boton.disabled = false;
    } else {
      this.isMayor = false;
    }
  }

  setnumberofnewlabels(){
    this.numberofnewlabels = this.formulariodenumero.get("numberofnewlabels")?.value;
    this.sendIsPressed = true;
    const pca = new PCA(this.datosTabla, { center: true });
    this.pcaCumuVal = pca.getCumulativeVariance();
    this.pcaEigenValues = pca.getEigenvalues();
    this.pcaEigenVectors = pca.getEigenvectors().to2DArray();
    this.pcaExplVar = pca.getExplainedVariance();
    this.pcaLoad = pca.getLoadings().to2DArray();
    this.pcaStandDev = pca.getStandardDeviations();
    this.resultPCA = pca.predict(this.datosTabla).to2DArray();

    this.standarizedDataset = this.standardizeArray(this.datosTabla);

    var pcaStand = new PCA(this.standarizedDataset, {center:true});
    this.resultPCAStand = pcaStand.predict(this.standarizedDataset).to2DArray();


    if(this.datosTabla[0].length===2){
      this.twoLabels = true;
    }

    if(this.numberofnewlabels === 2){
      this.isTwo = true;
      this.isOne = false;
      for (var i = 0; i< this.datosTabla.length; i++) {
        this.dataset2.push([this.resultPCA[i][0],this.resultPCA[i][1]]);
        this.dataset2Stand.push([this.resultPCAStand[i][0],this.resultPCAStand[i][1]])
      }
    } else if(this.numberofnewlabels === 1){
      this.isTwo = false;
      this.isOne = true;
      for (var i = 0; i< this.datosTabla.length; i++) {
        this.dataset1.push([this.resultPCA[i][0],0]);
        this.dataset1Stand.push([this.resultPCAStand[i][0],0]);
      }
    } else {
      this.isTwo = false;
      this.isOne = false;
      for (var i = 0; i< this.datosTabla.length; i++) {
        this.dataset1.push([this.resultPCA[i][0],0]);
        this.dataset1Stand.push([this.resultPCAStand[i][0],0]);
      }
    }
  }

  showPredictionsFun(){
    this.showPredictions = !this.showPredictions;
  }

  standardizeArray(arr: number[][]): number[][] {
    const n = arr.length;
    const m = arr[0].length;
    const means = new Array(m).fill(0);
    const stds = new Array(m).fill(0);

    // calcular la media y la desviación estándar de cada columna
    for (let j = 0; j < m; j++) {
      let sum = 0;
      for (let i = 0; i < n; i++) {
        sum += arr[i][j];
      }
      const mean = sum / n;
      means[j] = mean;

      let variance = 0;
      for (let i = 0; i < n; i++) {
        variance += (arr[i][j] - mean) ** 2;
      }
      const std = Math.sqrt(variance / n);
      stds[j] = std;
    }

    // normalizar los datos utilizando el z-score
    const standardizedArr = new Array(n);
    for (let i = 0; i < n; i++) {
      standardizedArr[i] = new Array(m);
      for (let j = 0; j < m; j++) {
        standardizedArr[i][j] = (arr[i][j] - means[j]) / stds[j];
      }
    }

    return standardizedArr;
  }
}
