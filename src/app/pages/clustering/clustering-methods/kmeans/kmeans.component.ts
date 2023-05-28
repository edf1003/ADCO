import { Component, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { sendDistances } from 'src/app/services/sendDistances.service';
import { sendDataTable } from 'src/app/services/sendDataTable.service';
import { ColorsToSend } from 'src/app/services/colors.service';
import { ResumePdf } from 'src/app/services/resumePdf.service';
import { TranslationService } from '../../../../services/translation.service';

@Component({
  selector: 'app-kmeans',
  templateUrl: './kmeans.component.html',
  styleUrls: ['./kmeans.component.scss'],
})
export class KmeansComponent implements OnInit {
  @Output() labels: number[] = [];
  centroids: number[] = [];
  distanceForm: FormGroup;
  numberOfClusters: number = 0;
  distancesEucl: number[][] = [];
  distancesEuclNor: number[][] = [];
  distancesMaha: number[][] = [];
  initialPoints: number[][] = [];
  distanceType: string = '';
  private distancesSub: Subscription;
  private initalPointsSub: Subscription;
  showResults: boolean = false;
  @Input() distance: string = '';

  constructor(
    private senddistances: sendDistances,
    private sendDataTable: sendDataTable,
    private colorToSend: ColorsToSend,
    public resumePdf: ResumePdf,
    public translationService: TranslationService
  ) {
    this.distanceForm = new FormGroup({
      numberOfClusters: new FormControl(),
    });
    this.distancesSub = this.senddistances
      .getEuclideanDistances()
      .subscribe((datos) => {
        this.distancesEucl = datos;
      });
    this.distancesSub = this.senddistances
      .getEuclideanNormalizedDistances()
      .subscribe((datos) => {
        this.distancesEuclNor = datos;
      });
    this.distancesSub = this.senddistances
      .getMahalanobisDistances()
      .subscribe((datos) => {
        this.distancesMaha = datos;
      });
    this.initalPointsSub = this.sendDataTable
      .getDatosTabla()
      .subscribe((datos) => {
        this.initialPoints = datos;
      });
  }

  ngOnInit(): void {}

  saveParameters() {
    this.numberOfClusters = this.distanceForm.get('numberOfClusters')!.value;
    if (this.initialPoints.length <= this.numberOfClusters) {
      return;
    }
    if (this.distance === 'Euclidea normalizada') {
      this.kMeans(this.distancesEuclNor, this.numberOfClusters);
    } else if (this.distance === 'Euclidea') {
      this.kMeans(this.distancesEucl, this.numberOfClusters);
    } else if (this.distance === 'Mahalanobis') {
      this.kMeans(this.distancesMaha, this.numberOfClusters);
    }
    this.showResults = true;
  }

  kMeans(distances: number[][], k: number) {
    const maxIterations = 100;
    const n = distances.length;
    const d = distances[0].length;
    let assignments = new Array(n).fill(0);
    let centroids = this.initializeCentroids(distances, k);

    let converged = false;
    let iteration = 0;

    while (!converged && iteration < maxIterations) {
      const newAssignments = this.assignPoints(distances, centroids);
      converged = true;

      for (let i = 0; i < n; i++) {
        if (newAssignments[i] !== assignments[i]) {
          converged = false;
          break;
        }
      }

      assignments = newAssignments;
      centroids = this.updateCentroids(distances, assignments, k);
      iteration++;
    }
    this.labels = assignments;
  }

  assignPoints(distances: number[][], centroids: number[][]): number[] {
    const n = distances.length;
    const assignments = new Array(n);

    for (let i = 0; i < n; i++) {
      let minDist = Infinity;
      let closestCentroid = -1;

      for (let j = 0; j < centroids.length; j++) {
        const dist = this.calculateDistance(distances[i], centroids[j]);

        if (dist < minDist) {
          minDist = dist;
          closestCentroid = j;
        }
      }

      assignments[i] = closestCentroid;
    }

    return assignments;
  }

  initializeCentroids(distances: number[][], k: number): number[][] {
    const n = distances.length;
    const d = distances[0].length;
    const centroids = new Array(k);
    const assignedPoints = new Set();

    for (let i = 0; i < k; i++) {
      let maxDist = -Infinity;
      let farthestPoint = -1;

      for (let j = 0; j < n; j++) {
        if (!assignedPoints.has(j)) {
          let minDist = Infinity;

          for (let l = 0; l < n; l++) {
            if (assignedPoints.has(l)) continue;
            const dist = this.calculateDistance(distances[j], distances[l]);

            if (dist < minDist) {
              minDist = dist;
            }
          }

          if (minDist > maxDist) {
            maxDist = minDist;
            farthestPoint = j;
          }
        }
      }

      assignedPoints.add(farthestPoint);
      centroids[i] = distances[farthestPoint].slice();
    }

    return centroids;
  }

  updateCentroids(
    distances: number[][],
    assignments: number[],
    k: number
  ): number[][] {
    const n = distances.length;
    const d = distances[0].length;
    const centroids = new Array(k);
    const counts = new Array(k).fill(0);

    for (let i = 0; i < n; i++) {
      const assignment = assignments[i];
      counts[assignment]++;
    }

    for (let i = 0; i < k; i++) {
      const centroid = new Array(d).fill(0);

      for (let j = 0; j < n; j++) {
        if (assignments[j] === i) {
          for (let m = 0; m < d; m++) {
            centroid[m] += distances[j][m];
          }
        }
      }

      for (let m = 0; m < d; m++) {
        centroid[m] /= counts[i] || 1;
      }

      centroids[i] = centroid;
    }

    return centroids;
  }

  calculateDistance(point1: number[], point2: number[]): number {
    const d = point1.length;
    let sum = 0;

    for (let i = 0; i < d; i++) {
      sum += Math.pow(point1[i] - point2[i], 2);
    }

    return Math.sqrt(sum);
  }

  getColor(index: number): string {
    var grupoElement = document.getElementById('grupo' + index);
    grupoElement!.style.backgroundColor = ColorsToSend.getColor(index);
    return ColorsToSend.getColor(index);
  }

  convertHTMLtoPDF() {
    this.resumePdf.convertHTMLtoPDF('kmeans', 'Resultado.pdf');
  }
}
