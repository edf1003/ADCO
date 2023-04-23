import { Component, OnInit } from '@angular/core';
import { PCAdata } from '../../services/PCAdata.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-clustering',
  templateUrl: './clustering.component.html',
  styleUrls: ['./clustering.component.scss']
})
export class ClusteringComponent implements OnInit {

  distances: string[] = ["Euclidea", "Euclidea normalizada", "Mahalanobis"];
  distance: string = "";
  clusteringMethods: string[] = ["DBSCAN", "OPTICS", "K-means", "SOM"];
  clusteringMethod: string = "";
  PCAdata: number[][] = [];
  euclideanDistaces: number[][] = [];
  normalizedEuclideanDistaces: number[][] = [];
  mahalanobisDistances: number[][] = [];
  lenghtOfData: any;
  private PCASub: Subscription;

  constructor(private pcadata: PCAdata) {
    this.PCASub = this.pcadata.getDatosTabla().subscribe(datos => {
      this.PCAdata = datos;
    });
   }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.PCASub.unsubscribe();
  }

  selectDistance(distance: string){
    this.distance = distance;
    this.lenghtOfData = Array.from({length: this.PCAdata.length}, (_, i) => i);
    if (this.distance === "Euclidea"){
      this.euclideanDistances();
    } else if (this.distance === "Euclidea normalizada"){
      this.calculateNormalizedDistances();
    } else if (this.distance === "Mahalanobis"){
      this.calculateMahalanobisDistances();
    }
  }

  selectClustering(clusteringMethod: string){
    this.clusteringMethod = clusteringMethod;
    if (this.clusteringMethod === "DBSCAN"){}
    else if (this.clusteringMethod === "OPTICS"){}
    else if (this.clusteringMethod === "K-means"){}
    else if (this.clusteringMethod === "SOM"){}
  }

  euclideanDistances(){
      const distances: number[][] = [];
      for (let i = 0; i < this.PCAdata.length; i++) {
        distances[i] = [];
        for (let j = 0; j < this.PCAdata.length; j++) {
          const distance = this.euclideanDistance(this.PCAdata[i][0], this.PCAdata[i][1], this.PCAdata[j][0], this.PCAdata[j][1]);
          distances[i][j] = distance;
        }
      }
      this.euclideanDistaces = distances;
  }

  euclideanDistance(x1: number, y1: number, x2: number, y2: number): number {
    const deltaX = x2 - x1;
    const deltaY = y2 - y1;
    return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  }

  calculateNormalizedDistances() {
    const distances: number[][] = [];
    let maxDistance = 0;

    // Calcula todas las distancias euclidianas entre cada par de puntos en el conjunto
    for (let i = 0; i < this.PCAdata.length; i++) {
      distances[i] = [];
      for (let j = 0; j < this.PCAdata.length; j++) {
        const distance = this.euclideanDistance(this.PCAdata[i][0], this.PCAdata[i][1], this.PCAdata[j][0], this.PCAdata[j][1]);
        distances[i][j] = distance;
        if (distance > maxDistance) {
          maxDistance = distance;
        }
      }
    }

    // Normaliza las distancias dividiéndolas por la distancia máxima en el conjunto
    for (let i = 0; i < this.PCAdata.length; i++) {
      for (let j = 0; j < this.PCAdata.length; j++) {
        distances[i][j] = distances[i][j] / maxDistance;
      }
    }
    this.normalizedEuclideanDistaces = distances;
  }

  mean(arr) {
    return this.sum(arr) / arr.length;
  }

  sum(arr) {
    return arr.reduce(function(a, b) {
      return a + b;
    });
  }

  calculateMahalanobisDistances(){
    const n = this.PCAdata.length;
    const means = new Array(2).fill(0);
    for (let i = 0; i < n; i++) {
      means[0] += this.PCAdata[i][0];
      means[1] += this.PCAdata[i][1];
    }
    means[0] /= n;
    means[1] /= n;

    const cov = new Array(4).fill(0);
    for (let i = 0; i < n; i++) {
      const x0 = this.PCAdata[i][0] - means[0];
      const x1 = this.PCAdata[i][1] - means[1];
      cov[0] += x0 * x0;
      cov[1] += x0 * x1;
      cov[2] += x1 * x0;
      cov[3] += x1 * x1;
    }
    cov[0] /= n - 1;
    cov[1] /= n - 1;
    cov[2] /= n - 1;
    cov[3] /= n - 1;

    const covInv = [
      [cov[3], -cov[1]],
      [-cov[2], cov[0]],
    ];
    const det = cov[0] * cov[3] - cov[1] * cov[2];
    const covInvDet = [
      [cov[3] / det, -cov[1] / det],
      [-cov[2] / det, cov[0] / det],
    ];

    const distances = new Array(n);
    for (let i = 0; i < n; i++) {
      distances[i] = new Array(n);
      for (let j = 0; j < n; j++) {
        const x0 = this.PCAdata[j][0] - this.PCAdata[i][0];
        const x1 = this.PCAdata[j][1] - this.PCAdata[i][1];
        const prod = [
          [x0, x1],
          [x0, x1],
        ];
        const prodT = [
          [x0, x0],
          [x1, x1],
        ];
        const distance = Math.sqrt(
          this.dot(this.dot(prod, covInv), prodT)[0][0]
        );
        distances[i][j] = distance;
      }
    }

    this.mahalanobisDistances = distances;
  }

  dot(A: number[][], B: number[][]): number[][] {
    const result: number[][] = [];
    const n = A.length;
    const m = B[0].length;
    const p = B.length;

    for (let i = 0; i < n; i++) {
      const row: number[] = [];
      for (let j = 0; j < m; j++) {
        let sum = 0;
        for (let k = 0; k < p; k++) {
          sum += A[i][k] * B[k][j];
        }
        row.push(sum);
      }
      result.push(row);
    }
    return result;
  }
}
