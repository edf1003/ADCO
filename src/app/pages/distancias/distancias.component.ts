import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { sendDataTable } from 'src/app/services/sendDataTable.service';
import { sendDistances } from 'src/app/services/sendDistances.service';
import * as math from 'mathjs';
import { ResumeExcel } from 'src/app/services/resumeExcel.service';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-distancias',
  templateUrl: './distancias.component.html',
  styleUrls: ['./distancias.component.scss'],
})
export class DistanciasComponent implements OnInit {
  distances: string[] = ['Euclidea', 'Euclidea normalizada', 'Mahalanobis'];
  distance: string = '';
  initialDataset: number[][] = [];
  euclideanDistaces: number[][] = [];
  normalizedEuclideanDistances: number[][] = [];
  mahalanobisDistances: number[][] = [];
  lenghtOfData: any;
  private PCASub: Subscription;

  constructor(
    private initialData: sendDataTable,
    private sendDistances: sendDistances,
    private resumeExcel: ResumeExcel,
    public translationService: TranslationService
  ) {
    this.PCASub = this.initialData.getDatosTabla().subscribe((datos) => {
      this.initialDataset = datos;
      this.generarDistancias();
    });
  }

  ngOnInit(): void {}

  generarDistancias() {
    this.euclideanDistances();
    this.calculateNormalizedDistances();
    this.calculateMahalanobisDistances();
    this.sendDistances.setEuclideanDistances(this.euclideanDistaces);
    this.sendDistances.setEuclideanNormalizedDistances(
      this.normalizedEuclideanDistances
    );
    this.sendDistances.setMahalanobisDistances(this.mahalanobisDistances);
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

  /*------- Inicio Euclidea Normalizada ---------- */

  calculateNormalizedDistances() {
    this.normalizedEuclideanDistances = [];

    for (let i = 0; i < this.initialDataset.length; i++) {
      const distances: number[] = [];

      for (let j = 0; j < this.initialDataset.length; j++) {
        if (i === j) {
          distances.push(0);
        } else {
          const distance = this.calculateNormalizedEuclideanDistance(
            this.initialDataset[i],
            this.initialDataset[j]
          );
          distances.push(distance);
        }
      }

      this.normalizedEuclideanDistances.push(distances);
    }
  }

  calculateNormalizedEuclideanDistance(
    point1: number[],
    point2: number[]
  ): number {
    const normalizedPoint1 = this.normalizeData(point1);
    const normalizedPoint2 = this.normalizeData(point2);

    return this.euclideanDistance(normalizedPoint1, normalizedPoint2);
  }

  normalizeData(data: number[]): number[] {
    let normalizedData: number[] = [];
    for (let i = 0; i < this.initialDataset[0].length; i++) {
      let max = -Infinity;
      for (let j = 0; j < this.initialDataset.length; j++) {
        if (this.initialDataset[j][i] > max) {
          max = this.initialDataset[j][i];
        }
      }
      normalizedData[i] = data[i] / max;
    }
    return normalizedData;
  }

  /*------- Fin Euclidea Normalizada ---------- */

  /*------- Inicio Mahalanobis ---------- */

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

    const firstMult = this.multiplyMatrixVector(
      invCovarianceMatrix,
      diffVector
    );
    const resultMatrix = this.multiplyVectorMatrix(
      firstMult,
      transposedDiffVector
    );

    return Math.sqrt(resultMatrix[0]);
  }

  subtractVectors(v1: number[], v2: number[]): number[] {
    const difVectors: number[] = [];

    for (let i = 0; i < v1.length; i++) {
      difVectors[i] = v2[i] - v1[i];
    }
    return difVectors;
  }

  transposeVector(vector: number[]): number[][] {
    const trasVectors: number[][] = [];

    for (let i = 0; i < vector.length; i++) {
      trasVectors.push([vector[i]]);
    }
    return trasVectors;
  }

  multiplyMatrixVector(matrix: number[][], vector: number[]): number[] {
    const result: number[] = [];

    for (let i = 0; i < matrix.length; i++) {
      let sum = 0;
      for (let j = 0; j < vector.length; j++) {
        sum += matrix[i][j] * vector[j];
      }
      result.push(sum);
    }

    return result;
  }

  multiplyVectorMatrix(vector: number[], matrix: number[][]): number[] {
    const result: number[] = [];

    for (let i = 0; i < matrix.length; i++) {
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
        means[i] += point[i] / points.length;
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
            ((point[i] - means[i]) * (point[j] - means[j])) / (numPoints - 1);
        }
      }
    }

    return covarianceMatrix;
  }

  /*------- Fin Mahalanobis ---------- */

  saveData() {
    this.resumeExcel.clearExcel();
    this.euclideanDistances();
    this.calculateNormalizedDistances();
    this.calculateMahalanobisDistances();
    this.resumeExcel.addData('DistanciaEuclidea', this.euclideanDistaces);
    this.resumeExcel.addData(
      'DistanciaEuclideaNormalizada',
      this.normalizedEuclideanDistances
    );
    this.resumeExcel.addData('DistanciaMahalanobis', this.mahalanobisDistances);
    this.resumeExcel.saveToFile();
  }
}
