import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { sendDataTable } from 'src/app/services/sendDataTable.service';
import { sendDistances } from 'src/app/services/sendDistances.service';

@Component({
  selector: 'app-distances',
  templateUrl: './distances.component.html',
  styleUrls: ['./distances.component.scss']
})
export class DistancesComponent implements OnInit {

  distances: string[] = ["Euclidea", "Euclidea normalizada", "Mahalanobis"];
  distance: string = "";
  initialDataset: number[][] = [];
  euclideanDistaces: number[][] = [];
  normalizedEuclideanDistances: number[][] = [];
  mahalanobisDistances: number[][] = [];
  lenghtOfData: any;
  private PCASub: Subscription;
  showEucDis: boolean = true;
  showEucNorDis: boolean = true;
  showMahDis: boolean = true;

  constructor(private initialData: sendDataTable, private sendDistances: sendDistances) {
    this.PCASub = this.initialData.getDatosTabla().subscribe(datos => {
      this.initialDataset = datos;
    });
   }

  ngOnInit(): void {
    this.euclideanDistances();
    this.calculateNormalizedDistances();
  }

  ngOnDestroy() {
    this.PCASub.unsubscribe();
  }

  selectDistance(distance: string){
    this.sendDistances.setDistancetype(distance);
    this.distance = distance;
    this.lenghtOfData = Array.from({length: this.initialDataset.length}, (_, i) => i);
    this.euclideanDistances();
    this.calculateNormalizedDistances();
    this.sendDistances.setEuclideanDistances(this.euclideanDistaces);
    this.sendDistances.setEuclideanNormalizedDistances(this.normalizedEuclideanDistances);
  }

  euclideanDistances(){
      const distances: number[][] = [];
      for (let i = 0; i < this.initialDataset.length; i++) {
        distances[i] = [];
        for (let j = 0; j < this.initialDataset.length; j++) {
          const distance = this.euclideanDistance(this.initialDataset[i], this.initialDataset[j]);
          distances[i][j] = distance;
        }
      }
      this.euclideanDistaces = distances;
  }

  euclideanDistance(element1: number[], element2: number[]): number {
    var distance = 0;
    for (let i = 0; i < element1.length; i++){
      distance += ((element2[i].valueOf() - element1[i].valueOf()) * (element2[i].valueOf() - element1[i].valueOf()))
    }
    return Math.sqrt(distance);
  }

  calculateNormalizedDistances() {
    const distances: number[][] = [];
    let maxDistance = 0;

    // Calcula todas las distancias euclidianas entre cada par de puntos en el conjunto
    for (let i = 0; i < this.initialDataset.length; i++) {
      distances[i] = [];
      for (let j = 0; j < this.initialDataset.length; j++) {
        const distance = this.euclideanDistance(this.initialDataset[i], this.initialDataset[j]);
        distances[i][j] = distance;
        if (distance > maxDistance) {
          maxDistance = distance;
        }
      }
    }
    // Normaliza las distancias dividiéndolas por la distancia máxima en el conjunto
    for (let i = 0; i < this.initialDataset.length; i++) {
      for (let j = 0; j < this.initialDataset.length; j++) {
        distances[i][j] = distances[i][j] / maxDistance;
      }
    }
    this.normalizedEuclideanDistances = distances;
  }

  showEucDist(){
    this.showEucDis = !this.showEucDis;
    var a = document.getElementById('ShowEuDis');
    if (this.showEucDis)
      a!.textContent = "Ocultar";
    else
      a!.textContent = "Mostrar";
  }

  showEucNorDist(){
    this.showEucNorDis = !this.showEucNorDis;
    var b = document.getElementById('showEucNorDis');
    if (this.showEucNorDis)
      b!.textContent = "Ocultar";
    else
      b!.textContent = "Mostrar";
  }

  showMahDist(){
    this.showMahDis = !this.showMahDis;
    var a = document.getElementById('showMahDis');
    if (this.showMahDis)
      a!.textContent = "Ocultar";
    else
      a!.textContent = "Mostrar";
  }

}
