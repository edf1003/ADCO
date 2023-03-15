import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { sendDataTable } from '../../services/sendDataTable.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-acp',
  templateUrl: './acp.component.html',
  styleUrls: ['./acp.component.scss']
})
export class AcpComponent  implements OnDestroy {

  numberofnewlabels : number = 0;
  formulariodenumero: FormGroup;
  datosTabla: string[][] = [];
  private datosTablaSub: Subscription;
  twoLabels: boolean = false;

  constructor(private sendData: sendDataTable) {
    this.formulariodenumero = new FormGroup({});
    const control = new FormControl('');
    this.formulariodenumero.addControl("numberofnewlabels", control);
    this.datosTablaSub = this.sendData.getDatosTabla().subscribe(datos => {
      this.datosTabla = datos;
      });
    if (this.datosTabla.length === 2){
      this.twoLabels = true;
    }
  }


  ngOnDestroy() {
    this.datosTablaSub.unsubscribe();
  }

  setnumberofnewlabels(){
    this.numberofnewlabels = this.formulariodenumero.get("numberofnewlabels")?.value;
    if(this.datosTabla[0].length===2){
      this.twoLabels = true;
    }
  }
}
