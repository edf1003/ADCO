import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { FooterBar } from 'src/components/footer-bar/footer-bar.component';
import { menuSelector } from 'src/components/menu-selector/menu-selector.component';
import { pageTitle } from 'src/components/page-title/page-title.component';
import { data } from '../app/pages/data/data.component';
import { AddvariablesComponent } from './pages/data/addvariables/addvariables.component';
import { ScarttChartComponent } from '../components/scartt-chart/scartt-chart.component';
import { NumberFormatPipe } from '../pipes/numberFormat';
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
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatStepperModule } from '@angular/material/stepper';
import { AcpComponent } from './pages/acp/acp.component';
import { NgChartsModule } from 'ng2-charts';
import { ClusteringComponent } from './pages/clustering/clustering.component';
import { ClusteringMethodsComponent } from './pages/clustering/clustering-methods/clustering-methods.component';
import { DbscanComponent } from './pages/clustering/clustering-methods/dbscan/dbscan.component';
import { OpticsComponent } from './pages/clustering/clustering-methods/optics/optics.component';
import { KmeansComponent } from './pages/clustering/clustering-methods/kmeans/kmeans.component';
import { OutliersComponent } from './pages/outliers/outliers.component';
import { DistanciasComponent } from './pages/distancias/distancias.component';
import { MahalanobisOutComponent } from './pages/outliers/mahalanobis-out/mahalanobis-out.component';
import { DbscanOutComponent } from './pages/outliers/dbscan-out/dbscan-out.component';
import { OpticsOutComponent } from './pages/outliers/optics-out/optics-out.component';
import { KNearestOutComponent } from './pages/outliers/k-nearest-out/k-nearest-out.component';
import { LofOutComponent } from './pages/outliers/lof-out/lof-out.component';

@NgModule({
  declarations: [
    AppComponent,
    information,
    menuSelector,
    FooterBar,
    pageTitle,
    data,
    AddvariablesComponent,
    AcpComponent,
    ScarttChartComponent,
    NumberFormatPipe,
    ClusteringComponent,
    ClusteringMethodsComponent,
    DbscanComponent,
    OpticsComponent,
    KmeansComponent,
    OutliersComponent,
    DistanciasComponent,
    MahalanobisOutComponent,
    DbscanOutComponent,
    OpticsOutComponent,
    KNearestOutComponent,
    LofOutComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    FormsModule,
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
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatTableModule,
    NgChartsModule,
    MatStepperModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
