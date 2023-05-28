import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { sendDistances } from 'src/app/services/sendDistances.service';
import { sendDataTable } from 'src/app/services/sendDataTable.service';
import { ResumePdf } from 'src/app/services/resumePdf.service';
import { TranslationService } from '../../../services/translation.service';

@Component({
  selector: 'app-lof-out',
  templateUrl: './lof-out.component.html',
  styleUrls: ['./lof-out.component.scss'],
})
export class LofOutComponent implements OnInit {
  distanceForm: FormGroup;
  distanceMax: number = 0;
  showResults: boolean = false;
  distancesEucl: number[][] = [];
  initialPoints: number[][] = [];
  results: number[] = [];
  private distancesSub: Subscription;
  private initalPointsSub: Subscription;

  constructor(
    private senddistances: sendDistances,
    private sendDataTable: sendDataTable,
    public resumePdf: ResumePdf,
    public translationService: TranslationService
  ) {
    this.distanceForm = new FormGroup({
      distance: new FormControl(),
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
    this.showResults = true;
    this.distanceMax = this.distanceForm.get('distance')!.value;
    this.results = this.calculateLOF(this.distancesEucl, this.distanceMax);
  }

  calculateLOF(distances: number[][], maxDistance: number): number[] {
    const n = distances.length;
    const LOF: number[] = [];

    for (let i = 0; i < n; i++) {
      let neighbors = 0;
      let reachabilityDistances: number[] = [];

      for (let j = 0; j < n; j++) {
        if (distances[i][j] <= maxDistance) {
          neighbors++;
          reachabilityDistances.push(
            Math.max(distances[i][j], distances[j][i])
          );
        }
      }

      let localReachabilityDensity = 0;
      if (neighbors > 0) {
        localReachabilityDensity =
          reachabilityDistances.reduce((sum, dist) => sum + dist, 0) /
          neighbors;
      }

      let lrdSum = 0;

      for (let j = 0; j < n; j++) {
        if (distances[i][j] <= maxDistance) {
          let lrd = 0;
          if (
            reachabilityDistances[j] !== 0 &&
            localReachabilityDensity !== 0
          ) {
            lrd = localReachabilityDensity / reachabilityDistances[j];
          }
          lrdSum += lrd;
        }
      }

      let LOFValue = 0;
      if (neighbors > 0) {
        LOFValue = lrdSum / (localReachabilityDensity * neighbors);
      }

      LOF.push(LOFValue);
    }

    return LOF;
  }

  isValueNaN(value: number): boolean {
    return isNaN(value);
  }

  convertHTMLtoPDF() {
    this.resumePdf.convertHTMLtoPDF('LOF', 'Resultado.pdf');
  }
}
