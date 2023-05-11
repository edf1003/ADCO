import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { sendDataTable } from 'src/app/services/sendDataTable.service';
import { sendDistances } from 'src/app/services/sendDistances.service';
import * as math from 'mathjs';
import { ResumeExcel } from 'src/app/services/resumeExcel.service';

@Component({
  selector: 'app-distances',
  templateUrl: './distances.component.html',
  styleUrls: ['./distances.component.scss'],
})
export class DistancesComponent implements OnInit {
  distances: string[] = ['Euclidea', 'Euclidea normalizada', 'Mahalanobis'];
  distance: string = '';
  initialDataset: number[][] = [];
  euclideanDistaces: number[][] = [];
  normalizedEuclideanDistances: number[][] = [];
  mahalanobisDistances: number[][] = [];
  lenghtOfData: any;
  private PCASub: Subscription;
  showEucDis: boolean = false;
  showEucNorDis: boolean = false;
  showMahDis: boolean = false;

  constructor(
    private initialData: sendDataTable,
    private sendDistances: sendDistances,
    private resumeExcel: ResumeExcel
  ) {
    this.PCASub = this.initialData.getDatosTabla().subscribe((datos) => {
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

  selectDistance(distance: string) {
    this.sendDistances.setDistancetype(distance);
    this.distance = distance;
    this.lenghtOfData = Array.from(
      { length: this.initialDataset.length },
      (_, i) => i
    );
    this.euclideanDistances();
    this.calculateNormalizedDistances();
    this.calculateMahalanobisDistances();
    this.sendDistances.setEuclideanDistances(this.euclideanDistaces);
    this.sendDistances.setEuclideanNormalizedDistances(
      this.normalizedEuclideanDistances
    );
    this.sendDistances.setMahalanobisDistances(this.mahalanobisDistances);
  }

  euclideanDistances() {
    const distances: number[][] = [];
    for (let i = 0; i < this.initialDataset.length; i++) {
      distances[i] = [];
      for (let j = 0; j < this.initialDataset.length; j++) {
        const distance = this.euclideanDistance(
          this.initialDataset[i],
          this.initialDataset[j]
        );
        distances[i][j] = distance;
      }
    }
    this.euclideanDistaces = distances;
  }

  euclideanDistance(element1: number[], element2: number[]): number {
    var distance = 0;
    for (let i = 0; i < element1.length; i++) {
      distance +=
        (element2[i].valueOf() - element1[i].valueOf()) *
        (element2[i].valueOf() - element1[i].valueOf());
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
        const distance = this.euclideanDistance(
          this.initialDataset[i],
          this.initialDataset[j]
        );
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

  calculateMahalanobisDistances() {
    const covarianceMatrix = this.calculateCovarianceMatrix(
      this.initialDataset
    );
    const distances: number[][] = [];

    for (let i = 0; i < this.initialDataset.length; i++) {
      const row: number[] = [];
      for (let j = 0; j < this.initialDataset.length; j++) {
        const distance = this.calculateMahalanobisDistance(
          this.initialDataset[i],
          this.initialDataset[j],
          covarianceMatrix
        );
        row.push(distance);
      }
      distances.push(row);
    }

    this.mahalanobisDistances = distances;
  }

  calculateMahalanobisDistance(
    p1: number[],
    p2: number[],
    covarianceMatrix: number[][]
  ): number {
    const diffVector = this.subtractVectors(p1, p2);
    const invCovarianceMatrix = math.inv(covarianceMatrix);
    const transposedDiffVector = this.transposeVector(diffVector);

    const resultMatrix = this.multiplyVectorMatrix(
      this.multiplyVectorMatrix(diffVector, invCovarianceMatrix),
      transposedDiffVector
    );

    return Math.sqrt(resultMatrix[0]);
  }

  subtractVectors(v1: number[], v2: number[]): number[] {
    return v1.map((value, index) => value - v2[index]);
  }

  transposeVector(vector: number[]): number[][] {
    return vector.map((value) => [value]);
  }

  multiplyVectorMatrix(vector: number[], matrix: number[][]): number[] {
    const result: number[] = [];

    for (let i = 0; i < matrix[0].length; i++) {
      let sum = 0;
      for (let j = 0; j < vector.length; j++) {
        sum += vector[j] * matrix[j][i];
      }
      result.push(sum);
    }

    return result;
  }

  calculateCovarianceMatrix(points: number[][]): number[][] {
    const dimensions = points[0].length;
    const numPoints = points.length;

    // Calcular la media de cada dimensión
    const means: number[] = new Array(dimensions).fill(0);
    for (const point of points) {
      for (let i = 0; i < dimensions; i++) {
        means[i] += point[i] / numPoints;
      }
    }

    // Calcular la matriz de covarianza
    const covarianceMatrix: number[][] = new Array(dimensions);
    for (let i = 0; i < dimensions; i++) {
      covarianceMatrix[i] = new Array(dimensions).fill(0);
    }

    for (const point of points) {
      for (let i = 0; i < dimensions; i++) {
        for (let j = 0; j < dimensions; j++) {
          covarianceMatrix[i][j] +=
            ((point[i] - means[i]) * (point[j] - means[j])) / numPoints;
        }
      }
    }

    return covarianceMatrix;
  }

  showEucDist() {
    this.showEucDis = !this.showEucDis;
    var a = document.getElementById('ShowEuDis');
    if (!this.showEucDis) a!.textContent = 'Mostrar';
    else a!.textContent = 'Ocultar';
  }

  showEucNorDist() {
    this.showEucNorDis = !this.showEucNorDis;
    var b = document.getElementById('showEucNorDis');
    if (!this.showEucNorDis) b!.textContent = 'Mostrar';
    else b!.textContent = 'Ocultar';
  }

  showMahDist() {
    this.showMahDis = !this.showMahDis;
    var a = document.getElementById('ShowMahDis');
    if (!this.showMahDis) a!.textContent = 'Mostrar';
    else a!.textContent = 'Ocultar';
  }

  saveData() {
    this.euclideanDistances();
    this.calculateNormalizedDistances();
    this.calculateMahalanobisDistances();
    this.resumeExcel.addData('DistanciaEuclidea', this.euclideanDistaces);
    this.resumeExcel.addData(
      'DistanciaEuclideaNormalizada',
      this.normalizedEuclideanDistances
    );
    this.resumeExcel.addData('DistanciaMahalanobis', this.mahalanobisDistances);
  }
}
