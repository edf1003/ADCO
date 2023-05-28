import { Component, OnInit, Output } from '@angular/core';
import { ResumePdf } from 'src/app/services/resumePdf.service';
import { TranslationService } from '../../../services/translation.service';

@Component({
  selector: 'app-clustering-methods',
  templateUrl: './clustering-methods.component.html',
  styleUrls: ['./clustering-methods.component.scss'],
})
export class ClusteringMethodsComponent implements OnInit {
  clusteringMethods: string[] = ['DBSCAN', 'OPTICS', 'K-means'];
  clusteringMethod: string = '';
  distances: string[] = ['Euclidea', 'Euclidea normalizada', 'Mahalanobis'];
  @Output() distance: string = '';

  constructor(
    public resumePdf: ResumePdf,
    public translationService: TranslationService
  ) {}

  ngOnInit(): void {}

  selectClustering(clusteringMethod: string) {
    this.clusteringMethod = clusteringMethod;
  }

  selectDistance(distance: string) {
    this.distance = distance;
  }

  convertHTMLtoPDF() {
    this.resumePdf.convertHTMLtoPDF(this.clusteringMethod, 'Resultado.pdf');
  }
}
