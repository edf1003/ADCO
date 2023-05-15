import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { sendDataTable } from 'src/app/services/sendDataTable.service';
import * as math from 'mathjs';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-mahalanobis-out',
  templateUrl: './mahalanobis-out.component.html',
  styleUrls: ['./mahalanobis-out.component.scss'],
})
export class MahalanobisOutComponent implements OnInit {
  initialDataset: number[][] = [];
  mahalanobisDistances: number[] = [];
  showResults: boolean = false;
  distanceForm: FormGroup;
  distanceMax: number = 0;
  private PCASub: Subscription;

  constructor(private initialData: sendDataTable) {
    this.PCASub = this.initialData.getDatosTabla().subscribe((datos) => {
      this.initialDataset = datos;
    });
    this.distanceForm = new FormGroup({
      distance: new FormControl(),
    });
  }

  ngOnInit(): void {
    this.calculateMahalanobisDistances();
  }

  saveParameters() {
    this.showResults = true;
    this.distanceMax = this.distanceForm.get('distance')!.value;
  }

  calculateMahalanobisDistances() {
    const covarianceMatrix = this.calculateCovarianceMatrix(
      this.initialDataset
    );
    const distances: number[] = [];
    var minPoint: number[] = [];
    this.initialDataset.forEach((element) => {
      minPoint.push(0);
    });

    for (let i = 0; i < this.initialDataset.length; i++) {
      const distance = this.calculateMahalanobisDistance(
        this.initialDataset[i],
        minPoint,
        covarianceMatrix
      );
      distances.push(distance);
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
            ((point[i] - means[i]) * (point[j] - means[j])) / (numPoints - 1);
        }
      }
    }

    return covarianceMatrix;
  }
}
