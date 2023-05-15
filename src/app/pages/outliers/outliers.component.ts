import { Component, OnInit } from '@angular/core';
import { ResumeExcel } from 'src/app/services/resumeExcel.service';

@Component({
  selector: 'app-outliers',
  templateUrl: './outliers.component.html',
  styleUrls: ['./outliers.component.scss'],
})
export class OutliersComponent implements OnInit {
  outliergMethods: string[] = [
    'Mahlanobis',
    'DBSCAN',
    'OPTICS',
    'K-nearest',
    'LOF',
  ];
  outlierMethod: string = '';

  constructor(public resumeExcel: ResumeExcel) {}

  ngOnInit(): void {}

  selectMethod(method: string) {
    this.outlierMethod = method;
  }
}
