import { Component, OnInit } from '@angular/core';
import { Dbscan } from '@turf/clusters-dbscan';

@Component({
  selector: 'app-clustering-methods',
  templateUrl: './clustering-methods.component.html',
  styleUrls: ['./clustering-methods.component.scss']
})
export class ClusteringMethodsComponent implements OnInit {

  clusteringMethods: string[] = ["DBSCAN", "OPTICS", "K-means", "SOM"];
  clusteringMethod: string = "";

  constructor() { }

  ngOnInit(): void {
  }

  selectClustering(clusteringMethod: string){
    this.clusteringMethod = clusteringMethod;
    if (this.clusteringMethod === "DBSCAN"){}
    else if (this.clusteringMethod === "OPTICS"){}
    else if (this.clusteringMethod === "K-means"){}
    else if (this.clusteringMethod === "SOM"){}
  }

  /*--------------------- DBSCAN -----------------------*/















  /*--------------------- DBSCAN END -----------------------*/
}
