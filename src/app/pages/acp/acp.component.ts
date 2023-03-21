import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { sendDataTable } from '../../services/sendDataTable.service';
import { Subscription } from 'rxjs';
import { PCA, PredictOptions } from "ml-pca";
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
    var pca = new PCA(this.datosTabla);
    this.pcaCumuVal = pca.getCumulativeVariance();
    this.pcaEigenValues = pca.getEigenvalues();
    this.pcaEigenVectors = pca.getEigenvectors().to2DArray();
    this.pcaExplVar = pca.getExplainedVariance();
    this.pcaLoad = pca.getLoadings().to2DArray();
    this.pcaStandDev = pca.getStandardDeviations();
    this.resultPCA = pca.predict(this.datosTabla).to2DArray();

    this.standarizedData()

    if(this.datosTabla[0].length===2){
      this.twoLabels = true;
    }

    if(this.numberofnewlabels === 2){
      this.isTwo = true;
      this.isOne = false;
      for (var i = 0; i< this.datosTabla.length; i++) {
        this.dataset2.push([this.resultPCA[i][0],this.resultPCA[i][1]]);
        this.dataset2Stand.push([this.standarizedDataset[i][0],this.standarizedDataset[i][1]])
      }
    } else if(this.numberofnewlabels === 1){
      this.isTwo = false;
      this.isOne = true;
      for (var i = 0; i< this.datosTabla.length; i++) {
        this.dataset1.push([this.resultPCA[i][0],0]);
        this.dataset1Stand.push([this.standarizedDataset[i][0],0]);
      }
    } else {
      this.isTwo = false;
      this.isOne = false;
      for (var i = 0; i< this.datosTabla.length; i++) {
        this.dataset1.push([this.resultPCA[i][0],0]);
        this.dataset1Stand.push([this.standarizedDataset[i][0],0]);
      }
    }
  }

  showPredictionsFun(){
    this.showPredictions = !this.showPredictions;
  }

  standarizedData(){
    let mediaValues: number[] = [];
    for(let i = 0; i<this.datosTabla[0].length; i++){
      mediaValues[i] = 0;
      for(let j = 0; j<this.datosTabla.length; j++){
        mediaValues[i] = mediaValues[i] + this.datosTabla[j][i];
      }
      mediaValues[i] = mediaValues[i] / this.datosTabla.length;
    }

    for (let i = 0; i < this.datosTabla.length; i++) {
      this.standarizedDataset[i] = [];
    }
    for (let i = 0; i < this.datosTabla.length; i++) {
      for (let j = 0; j < this.datosTabla[0].length; j++) {
        this.standarizedDataset[i][j] = 0;
      }
    }

    for(let i = 0; i<this.standarizedDataset.length; i++){
       for(let j = 0; j<this.standarizedDataset[0].length; j++){
        this.standarizedDataset[i][j] = ((this.resultPCA[i][j] - mediaValues[j])/this.pcaStandDev[j]);
      }
    }
  }
}
