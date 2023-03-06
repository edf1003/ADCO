import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-addvariables',
  templateUrl: './addvariables.component.html',
  styleUrls: ['./addvariables.component.scss']
})
export class AddvariablesComponent implements OnChanges {

  @Input() valor: number = 0;
  inputsArray: any[] = new Array(this.valor);

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.valor<10){
      this.inputsArray = new Array(this.valor);
    }
    else{
      this.valor = 0
      this.inputsArray = new Array(0);
    }
  }

}
