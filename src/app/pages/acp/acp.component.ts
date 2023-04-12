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
  showPredictions: boolean = true;
  isOne: boolean = false;
  isTwo: boolean = false;
  lenghtOfData: any;
  isStandarizezACP: boolean = false;
  showProperties: boolean = true;
  showEigenVectors: boolean = true;

  //All PCA values
  pcaCumuVal:  any;
  pcaEigenValues:  any;
  pcaEigenVectors: any;
  pcaExplVar:  any;
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
    if (numberofnewlabels > this.datosTabla[0].length) {
      boton.disabled = true;
      this.isMayor = true;
      boton.disabled = false;
    } else {
      this.isMayor = false;
    }
  }

  setnumberofnewlabels(){
    this.lenghtOfData = Array.from({length: this.datosTabla[0].length}, (_, i) => i);
    this.numberofnewlabels = this.formulariodenumero.get("numberofnewlabels")?.value;
    this.sendIsPressed = true;
    const pca = new PCA(this.datosTabla, { center: true, scale: false });
    this.pcaCumuVal = pca.getCumulativeVariance();
    this.pcaEigenValues = pca.getEigenvalues();
    this.pcaEigenVectors = pca.getEigenvectors().to2DArray();
    this.pcaExplVar = pca.getExplainedVariance();
    this.pcaStandDev = pca.getStandardDeviations();
    this.resultPCA = pca.predict(this.datosTabla).to2DArray();


    var pcaStand = new PCA(this.datosTabla, {center:true, scale: true});
    this.resultPCAStand = pcaStand.predict(this.datosTabla).to2DArray();


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
    let showACP = document.getElementById("ShowACP");
    let showACP2 = document.getElementById("ShowACP2");
    if (this.showPredictions){
      showACP!.textContent = "Ocultar";
      showACP2!.textContent = "Ocultar";
    }
    else {
      showACP!.textContent = "Mostrar";
      showACP2!.textContent = "Mostrar";
    }
  }

  standarizeACP(){
    this.isStandarizezACP = !this.isStandarizezACP;
  }

  showPropertiesTable(){
    this.showProperties = !this.showProperties;
    let showProperties = document.getElementById("showProperties");
    if (this.showProperties){
      showProperties!.textContent = "Ocultar";
    }
    else {
      showProperties!.textContent = "Mostrar";
    }
  }

  showEigenVectorsTable(){
    this.showEigenVectors = !this.showEigenVectors;
    let showEigenVectors = document.getElementById("showEigenVectors");
    if (this.showEigenVectors){
      showEigenVectors!.textContent = "Ocultar";
    }
    else {
      showEigenVectors!.textContent = "Mostrar";
    }
  }



}
