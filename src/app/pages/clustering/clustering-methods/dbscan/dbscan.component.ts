import { Component, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { sendDistances } from 'src/app/services/sendDistances.service';
import { sendDataTable } from 'src/app/services/sendDataTable.service';
import { ColorsToSend } from 'src/app/services/colors.service';

@Component({
  selector: 'app-dbscan',
  templateUrl: './dbscan.component.html',
  styleUrls: ['./dbscan.component.scss'],
})
export class DbscanComponent {
  @Output() labels: number[] = [];
  distanceForm: FormGroup;
  distanceMax: number = 0;
  minPoints: number = 0;
  distancesEucl: number[][] = [];
  distancesEuclNor: number[][] = [];
  distancesMaha: number[][] = [];
  initialPoints: number[][] = [];
  distanceType: string = '';
  private distancesSub: Subscription;
  private initalPointsSub: Subscription;
  clusterIndex = 10;
  showResults: boolean = false;

  constructor(
    private senddistances: sendDistances,
    private sendDataTable: sendDataTable
  ) {
    this.distanceForm = new FormGroup({
      distance: new FormControl(),
      minPoints: new FormControl(),
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

  saveParameters() {
    this.distanceMax = this.distanceForm.get('distance')!.value;
    this.minPoints = this.distanceForm.get('minPoints')!.value;
    if (this.senddistances.getDistanceType() === 'Euclidea normalizada') {
      this.dbscan(this.distancesEuclNor, this.distanceMax, this.minPoints);
    } else if (this.senddistances.getDistanceType() === 'Euclidea') {
      this.dbscan(this.distancesEucl, this.distanceMax, this.minPoints);
    } else if (this.senddistances.getDistanceType() === 'Mahalanobis') {
      this.dbscan(this.distancesMaha, this.distanceMax, this.minPoints);
    }
    this.showResults = true;
  }

  dbscan(distances: number[][], eps: number, minPts: number) {
    const labels: number[] = [];
    this.clusterIndex = 0;

    // Inicializar todas las etiquetas como no asignadas (-1)
    for (let i = 0; i < distances.length; i++) {
      labels[i] = -1;
    }

    for (let i = 0; i < distances.length; i++) {
      // Si el punto ya ha sido asignado a un cluster, saltar a la siguiente iteración
      if (labels[i] !== -1) {
        continue;
      }

      const neighbors = this.findNeighbors(i, distances, eps);

      if (neighbors.length < minPts) {
        // Asignar a ruido (-2)
        labels[i] = -2;
      } else {
        // Asignar a un nuevo cluster
        this.assignCluster(
          i,
          neighbors,
          labels,
          this.clusterIndex,
          distances,
          eps,
          minPts
        );
        this.clusterIndex++;
      }
    }

    this.labels = labels;
  }

  findNeighbors(
    pointIndex: number,
    distances: number[][],
    eps: number
  ): number[] {
    const neighbors: number[] = [];

    for (let i = 0; i < distances.length; i++) {
      if (distances[pointIndex][i] <= eps) {
        neighbors.push(i);
      }
    }

    return neighbors;
  }

  assignCluster(
    pointIndex: number,
    neighbors: number[],
    labels: number[],
    clusterIndex: number,
    distances: number[][],
    eps: number,
    minPts: number
  ): void {
    labels[pointIndex] = clusterIndex;

    for (const neighborIndex of neighbors) {
      if (labels[neighborIndex] === -2) {
        // Asignar a un cluster de borde
        labels[neighborIndex] = clusterIndex;
      } else if (labels[neighborIndex] === -1) {
        // Asignar a un nuevo cluster
        labels[neighborIndex] = clusterIndex;

        const newNeighbors = this.findNeighbors(neighborIndex, distances, eps);

        if (newNeighbors.length >= minPts) {
          // Expandir cluster
          this.assignCluster(
            neighborIndex,
            newNeighbors,
            labels,
            clusterIndex,
            distances,
            eps,
            minPts
          );
        }
      }
    }
  }

  getColor(index: number): string {
    var grupoElement = document.getElementById('grupo' + index);
    grupoElement!.style.backgroundColor = ColorsToSend.getColor(index);
    return ColorsToSend.getColor(index);
  }
}
