import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class sendDistances {
  private euclideanDistances = new BehaviorSubject<number[][]>([]);
  private euclideanNormalizedDistances = new BehaviorSubject<number[][]>([]);

  setEuclideanDistances(distances: number[][]) {
    this.euclideanDistances.next(distances);
  }

  getEuclideanDistances() {
    return this.euclideanDistances.asObservable();
  }

  setEuclideanNormalizedDistances(distances: number[][]) {
    this.euclideanNormalizedDistances.next(distances);
  }

  getEuclideanNormalizedDistances() {
    return this.euclideanNormalizedDistances.asObservable();
  }

}
