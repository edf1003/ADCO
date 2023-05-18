import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ResumePdf } from 'src/app/services/resumePdf.service';
import { sendDataTable } from 'src/app/services/sendDataTable.service';
import { sendDistances } from 'src/app/services/sendDistances.service';

@Component({
  selector: 'app-k-nearest-out',
  templateUrl: './k-nearest-out.component.html',
  styleUrls: ['./k-nearest-out.component.scss'],
})
export class KNearestOutComponent implements OnInit {
  distanceForm: FormGroup;
  numberOfNeighbors: number = 0;
  showResults: boolean = false;
  initialPoints: number[][] = [];
  distancesEucl: number[][] = [];
  outliers: boolean[] = [];
  private initalPointsSub: Subscription;
  private distancesSub: Subscription;

  constructor(
    private sendDataTable: sendDataTable,
    private senddistances: sendDistances,
    public resumePdf: ResumePdf
  ) {
    this.distanceForm = new FormGroup({
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
    this.numberOfNeighbors = this.distanceForm.get('numberOfNeighbors')!.value;
    this.showResults = true;
    this.outliers = this.detectOutliers(
      this.initialPoints,
      this.distancesEucl,
      this.numberOfNeighbors
    );
  }

  detectOutliers(
    points: number[][],
    distances: number[][],
    k: number
  ): boolean[] {
    const distanceScores: number[] = [];

    // Calcular la distancia al k-ésimo vecino más cercano para cada punto
    for (let i = 0; i < points.length; i++) {
      const distancesToNeighbors = distances[i].slice(); // Copiar las distancias a los vecinos
      distancesToNeighbors.sort((a, b) => a - b); // Ordenar las distancias de menor a mayor

      const kthDistance = distancesToNeighbors[k - 1]; // Obtener la distancia al k-ésimo vecino más cercano
      distanceScores.push(kthDistance);
    }

    // Ordenar los puntos según los puntajes de distancia
    const sortedIndices = distanceScores
      .map((_, index) => index)
      .sort((a, b) => distanceScores[b] - distanceScores[a]);

    // Determinar los outliers en base a los puntajes de distancia
    const outlierFlags: boolean[] = Array(points.length).fill(false);
    for (let i = 0; i < k; i++) {
      outlierFlags[sortedIndices[i]] = true;
    }

    return outlierFlags;
  }

  convertHTMLtoPDF() {
    this.resumePdf.convertHTMLtoPDF('k-nearest', 'Resultado.pdf');
  }
}
