import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
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
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgChartsModule } from 'ng2-charts';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { AppComponent } from 'src/app/app.component';
import { FooterBar } from 'src/components/footer-bar/footer-bar.component';
import { MenuSelector } from 'src/components/menu-selector/menu-selector.component';
import { PageTitle } from 'src/components/page-title/page-title.component';
import { ScarttChartComponent } from 'src/components/scartt-chart/scartt-chart.component';
import { Data } from 'src/app/pages/data/data.component';
import { AddvariablesComponent } from 'src/app/pages/data/addvariables/addvariables.component';
import { Information } from 'src/app/pages/information/information.component';
import { AcpComponent } from 'src/app/pages/acp/acp.component';
import { ClusteringComponent } from 'src/app/pages/clustering/clustering.component';
import { ClusteringMethodsComponent } from 'src/app/pages/clustering/clustering-methods/clustering-methods.component';
import { DbscanComponent } from 'src/app/pages/clustering/clustering-methods/dbscan/dbscan.component';
import { OpticsComponent } from 'src/app/pages/clustering/clustering-methods/optics/optics.component';
import { KmeansComponent } from 'src/app/pages/clustering/clustering-methods/kmeans/kmeans.component';
import { OutliersComponent } from 'src/app/pages/outliers/outliers.component';
import { DistanciasComponent } from 'src/app/pages/distancias/distancias.component';
import { MahalanobisOutComponent } from 'src/app/pages/outliers/mahalanobis-out/mahalanobis-out.component';
import { DbscanOutComponent } from 'src/app/pages/outliers/dbscan-out/dbscan-out.component';
import { OpticsOutComponent } from 'src/app/pages/outliers/optics-out/optics-out.component';
import { KNearestOutComponent } from 'src/app/pages/outliers/k-nearest-out/k-nearest-out.component';
import { LofOutComponent } from 'src/app/pages/outliers/lof-out/lof-out.component';
import { TranslationService } from 'src/app/services/translation.service';
import { NumberFormatPipe } from 'src/pipes/numberFormat';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
@NgModule({
  declarations: [
    AppComponent,
    Information,
    MenuSelector,
    FooterBar,
    PageTitle,
    Data,
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
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [TranslationService],
  bootstrap: [AppComponent],
})
export class AppModule {}
