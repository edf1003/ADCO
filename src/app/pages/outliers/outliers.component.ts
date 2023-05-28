import { Component, OnInit } from '@angular/core';
import { ResumeExcel } from 'src/app/services/resumeExcel.service';
import { TranslationService } from '../../services/translation.service';

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
    'k-Nearest Neighbors',
    'LOF',
  ];
  outlierMethod: string = '';

  constructor(
    public resumeExcel: ResumeExcel,
    public translationService: TranslationService
  ) {}

  ngOnInit(): void {}

  selectMethod(method: string) {
    this.outlierMethod = method;
  }
}
