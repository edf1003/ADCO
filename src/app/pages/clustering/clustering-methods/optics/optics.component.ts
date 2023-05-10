import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { sendDistances } from 'src/app/services/sendDistances.service';
import { sendDataTable } from 'src/app/services/sendDataTable.service';
import { ColorsToSend } from 'src/app/services/colors.service';

@Component({
  selector: 'app-optics',
  templateUrl: './optics.component.html',
  styleUrls: ['./optics.component.scss'],
})
export class OpticsComponent implements OnInit {
  distanceForm: FormGroup;
  distanceMax: number = 0;
  minPoints: number = 0;
  labels: number[] = [];
  distancesEucl: number[][] = [];
  distancesEuclNor: number[][] = [];
  distancesMaha: number[][] = [];
  initialPoints: number[][] = [];
  private distancesSub: Subscription;
  private initalPointsSub: Subscription;
  showResults: boolean = false;
  clusterIndex = 0;

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

  ngOnInit(): void {}

  saveParameters() {
    this.distanceMax = this.distanceForm.get('distance')!.value;
    this.minPoints = this.distanceForm.get('minPoints')!.value;
    if (this.senddistances.getDistanceType() === 'Euclidea normalizada') {
      this.optics(this.distancesEuclNor, this.distanceMax, this.minPoints);
    } else if (this.senddistances.getDistanceType() === 'Euclidea') {
      this.optics(this.distancesEucl, this.distanceMax, this.minPoints);
    } else if (this.senddistances.getDistanceType() === 'Mahalanobis') {
      this.optics(this.distancesMaha, this.distanceMax, this.minPoints);
    }
    this.showResults = true;
  }

  optics(distances: number[][], epsilon: number, minPts: number) {
    const NOISE = -2;
    const UNDEFINED = -1;

    const n = distances.length;
    const reachability: number[] = new Array(n).fill(UNDEFINED);
    const processed: boolean[] = new Array(n).fill(false);
    const order: number[] = [];

    function getNeighbors(pointIdx: number): number[] {
      const neighbors: number[] = [];
      for (let i = 0; i < n; i++) {
        if (i !== pointIdx && distances[pointIdx][i] <= epsilon) {
          neighbors.push(i);
        }
      }
      return neighbors;
    }

    function update(pointIdx: number, neighbors: number[], seeds: number[]) {
      processed[pointIdx] = true;
      order.push(pointIdx);
      if (neighbors.length < minPts) {
        reachability[pointIdx] = NOISE;
      } else {
        reachability[pointIdx] = 0;
        seeds = expandClusterOrder(pointIdx, neighbors, seeds);
        seeds.forEach((seed) => {
          const seedNeighbors = getNeighbors(seed);
          if (!processed[seed]) {
            update(seed, seedNeighbors, seeds);
          }
        });
      }
    }

    function expandClusterOrder(
      pointIdx: number,
      neighbors: number[],
      seeds: number[]
    ): number[] {
      reachability[pointIdx] = Math.max(
        ...neighbors.map((neighborIdx) => distances[pointIdx][neighborIdx])
      );
      seeds = seeds.filter((seedIdx) => seedIdx !== pointIdx);
      seeds = seeds.concat(
        neighbors.filter((neighborIdx) => {
          if (!processed[neighborIdx]) {
            const neighborNeighbors = getNeighbors(neighborIdx);
            if (neighborNeighbors.length >= minPts) {
              seeds.push(neighborIdx);
            }
            return true;
          }
          return false;
        })
      );
      return seeds;
    }

    for (let i = 0; i < n; i++) {
      if (!processed[i]) {
        const neighbors = getNeighbors(i);
        update(i, neighbors, neighbors);
      }
    }

    const clusters: number[] = new Array(n).fill(NOISE);
    this.clusterIndex = 0;
    for (let i = 0; i < n; i++) {
      if (reachability[order[i]] !== NOISE && clusters[order[i]] === NOISE) {
        const cluster = [order[i]];
        for (let j = i + 1; j < n; j++) {
          if (
            reachability[order[j]] !== NOISE &&
            distances[order[i]][order[j]] <= epsilon
          ) {
            cluster.push(order[j]);
          }
        }
        cluster.forEach((clusterPointIdx) => {
          clusters[clusterPointIdx] = this.clusterIndex;
        });
        this.clusterIndex++;
      }
    }

    this.labels = clusters;
  }

  getColor(index: number): string {
    var grupoElement = document.getElementById('grupo' + index);
    grupoElement!.style.backgroundColor = ColorsToSend.getColor(index);
    return ColorsToSend.getColor(index);
  }
}
