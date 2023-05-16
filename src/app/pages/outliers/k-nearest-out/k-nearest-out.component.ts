import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { sendDataTable } from 'src/app/services/sendDataTable.service';
import { sendDistances } from 'src/app/services/sendDistances.service';

@Component({
  selector: 'app-k-nearest-out',
  templateUrl: './k-nearest-out.component.html',
  styleUrls: ['./k-nearest-out.component.scss'],
})
export class KNearestOutComponent implements OnInit {
  distanceForm: FormGroup;
  numberOfOutliers: number = 0;
  numberOfNeighbors: number = 0;
  showResults: boolean = false;
  initialPoints: number[][] = [];
  distancesEucl: number[][] = [];
  outliers: number[][] = [];
  private initalPointsSub: Subscription;
  private distancesSub: Subscription;

  constructor(
    private sendDataTable: sendDataTable,
    private senddistances: sendDistances
  ) {
    this.distanceForm = new FormGroup({
      numberOfOutliers: new FormControl(),
      numberOfNeighbors: new FormControl(),
    });
    this.initalPointsSub = this.sendDataTable
      .getDatosTabla()
      .subscribe((datos) => {
        this.initialPoints = datos;
      });
    this.distancesSub = this.senddistances
      .getEuclideanDistances()
      .subscribe((datos) => {
        this.distancesEucl = datos;
      });
  }

  ngOnInit(): void {}

  saveParameters() {
    this.numberOfOutliers = this.distanceForm.get('numberOfOutliers')!.value;
    this.numberOfNeighbors = this.distanceForm.get('numberOfNeighbors')!.value;
    this.showResults = true;
    this.getOutliers();
  }

  private getKNearestNeighbors(pointIndex: number): number[][] {
    const distances = this.distancesEucl[pointIndex];

    const sortedIndices = distances
      .map((_, index) => index)
      .sort((a, b) => distances[a] - distances[b])
      .slice(0, this.numberOfNeighbors);

    const kNearestNeighbors: number[][] = [];
    for (const index of sortedIndices) {
      kNearestNeighbors.push(this.initialPoints[index]);
    }

    return kNearestNeighbors;
  }

  getOutliers() {
    const outliers: number[][] = [];

    for (let i = 0; i < this.initialPoints.length; i++) {
      const kNearestNeighbors = this.getKNearestNeighbors(i);
      const distances = kNearestNeighbors.map(
        (neighbor) =>
          this.distancesEucl[i][this.initialPoints.indexOf(neighbor)]
      );
      const maxDistance = Math.max(...distances);

      if (maxDistance > this.numberOfOutliers) {
        outliers.push(this.initialPoints[i]);
      }
    }

    this.outliers = outliers;
  }
}
