import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { footer, footerAuth } from 'src/components/footer/footer.component';
import { menuSelector } from 'src/components/menuSelector/menuSelector.component';
import { pageTitle } from 'src/components/pageTitle/pageTitle.component';

import { AppRoutingModule } from '../../app-routing.module';
import { AppComponent } from '../../app.component';



@NgModule({
  declarations: [
    menuSelector,
    pageTitle,
    footerAuth
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
