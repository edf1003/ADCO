import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberFormat'
})
export class NumberFormatPipe implements PipeTransform {

  transform(value: number): string {
    if (value === 0){
      return "0";
    } else if (Math.abs(value) >= 1000) {
      return value.toExponential(3);
    } else if (Math.abs(value) <= 0.001) {
      return value.toExponential(3);
    } else {
      return value.toFixed(3);
    }
  }

}
