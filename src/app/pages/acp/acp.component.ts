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

  constructor(private sendData: sendDataTable) {
    this.formulariodenumero = new FormGroup({});
    const control = new FormControl('');
    this.formulariodenumero.addControl("numberofnewlabels", control);
    this.datosTablaSub = this.sendData.getDatosTabla().subscribe(datos => {
      this.datosTabla = datos;
      });
  }


  ngOnDestroy() {
    this.datosTablaSub.unsubscribe();
  }

  setnumberofnewlabels(){
    this.numberofnewlabels = this.formulariodenumero.get("numberofnewlabels")?.value;
    this.datosTablaSub = this.sendData.getDatosTabla().subscribe(datos => {
      this.datosTabla = datos;
      });
    window.alert(this.datosTabla[0]);
  }




}
