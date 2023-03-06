import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from '../../app/app-routing.module';
import { AppComponent } from '../../app/app.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';




@NgModule({
  declarations: [  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatSlideToggleModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class MenuSelectorModule { }
