import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-optics',
  templateUrl: './optics.component.html',
  styleUrls: ['./optics.component.scss']
})
export class OpticsComponent implements OnInit {

  distanceForm: FormGroup;
  distanceMax: number = 0;
  minPoints: number = 0;


  constructor() {
    this.distanceForm = new FormGroup({
      distance: new FormControl(),
      minPoints: new FormControl(),
    });
  }

  ngOnInit(): void {
  }

  saveParameters(){
    this.distanceMax = this.distanceForm.get('distance')!.value;
    this.minPoints = this.distanceForm.get('minPoints')!.value;
  }

}
