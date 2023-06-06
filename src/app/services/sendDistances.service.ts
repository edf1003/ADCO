import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class sendDistances {
  private euclideanDistances = new BehaviorSubject<number[][]>([]);
  private euclideanNormalizedDistances = new BehaviorSubject<number[][]>([]);
  private mahalanobisDistances = new BehaviorSubject<number[][]>([]);
  private distanceType: string = '';

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

  setMahalanobisDistances(distances: number[][]) {
    this.mahalanobisDistances.next(distances);
  }

  getMahalanobisDistances() {
    return this.mahalanobisDistances.asObservable();
  }

  setDistancetype(distance: string) {
    this.distanceType = distance;
  }
  getDistanceType() {
    return this.distanceType;
  }
}
