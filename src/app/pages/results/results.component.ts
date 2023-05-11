import { Component, OnInit } from '@angular/core';
import { ResumeExcel } from 'src/app/services/resumeExcel.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss'],
})
export class ResultsComponent implements OnInit {
  constructor(public resumeExcel: ResumeExcel) {}

  ngOnInit(): void {}

  saveData() {
    this.resumeExcel.saveToFile();
  }
}
