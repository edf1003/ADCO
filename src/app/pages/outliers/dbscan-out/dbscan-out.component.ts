import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { sendDistances } from 'src/app/services/sendDistances.service';
import { sendDataTable } from 'src/app/services/sendDataTable.service';
import { ResumePdf } from 'src/app/services/resumePdf.service';

@Component({
  selector: 'app-dbscan-out',
  templateUrl: './dbscan-out.component.html',
  styleUrls: ['./dbscan-out.component.scss'],
})
export class DbscanOutComponent implements OnInit {
  distanceForm: FormGroup;
  distanceMax: number = 0;
  minPoints: number = 0;
  clusterIndex: number = 0;
  labels: number[] = [];
  distancesEucl: number[][] = [];
  initialPoints: number[][] = [];
  private distancesSub: Subscription;
  private initalPointsSub: Subscription;
  showResults: boolean = false;

  constructor(
    private senddistances: sendDistances,
    private sendDataTable: sendDataTable,
    public resumePdf: ResumePdf
  ) {
    this.distanceForm = new FormGroup({
      distanceMax: new FormControl(),
      minPoints: new FormControl(),
    });
    this.distancesSub = this.senddistances
      .getEuclideanDistances()
      .subscribe((datos) => {
        this.distancesEucl = datos;
      });
    this.initalPointsSub = this.sendDataTable
      .getDatosTabla()
      .subscribe((datos) => {
        this.initialPoints = datos;
      });
  }

  ngOnInit(): void {}

  saveParameters() {
    this.distanceMax = this.distanceForm.get('distanceMax')!.value;
    this.minPoints = this.distanceForm.get('minPoints')!.value;
    this.dbscan(this.distancesEucl, this.distanceMax, this.minPoints);
    this.showResults = true;
  }

  dbscan(distances: number[][], eps: number, minPts: number) {
    const labels: number[] = [];

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

  convertHTMLtoPDF() {
    this.resumePdf.convertHTMLtoPDF('DBSCAN', 'Resultado.pdf');
  }
}
