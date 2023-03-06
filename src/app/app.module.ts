import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { footerAuth } from 'src/components/footer/footer.component';
import { menuSelector } from 'src/components/menuSelector/menuSelector.component';
import { pageTitle } from 'src/components/pageTitle/pageTitle.component';
import { data } from '../app/pages/data/data.component'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { information } from './pages/information/information.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';




@NgModule({
  declarations: [
    AppComponent,
    information,
    menuSelector,
    footerAuth,
    pageTitle,
    data
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSlideToggleModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatTabsModule,
    MatRadioModule,
    MatSelectModule,
    MatSliderModule,
    MatIconModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
