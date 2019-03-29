import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './../../auth.guard';

import { SharedService } from './../../shared.service';
import { GADataService } from './ga-chart-data.service';
import { GoogleAnalyticsComponent } from './google-analytics.component';
import { CanDeactivateGuardService } from './../../can-deactivate-guard.service';

import { Daterangepicker } from 'ng2-daterangepicker';

import { NgxChartsModule } from '@swimlane/ngx-charts';
import { AppSessionGraphComponent } from './app-session-graph.component';
import { FeatureVisitGraphComponent } from './feature-visit-graph.component';
import { AppDownloadGraphComponent } from './app-download-graph.component';

import { GoogleChart } from 'angular2-google-chart/directives/angular2-google-chart.directive';


export const routes: Routes = [
  { 
    path: 'google-analytics', 
    component: GoogleAnalyticsComponent,
    canActivate: [AuthGuard],
    canDeactivate: [CanDeactivateGuardService]},
];


@NgModule({

  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    RouterModule.forChild(routes),
    Daterangepicker,
    NgxChartsModule,
  ],

  declarations: [
    GoogleAnalyticsComponent,
    AppSessionGraphComponent,
    FeatureVisitGraphComponent,      
    AppDownloadGraphComponent, 
    GoogleChart,
  ],

  providers: [SharedService, GADataService],

})

export class GoogleAnalyticsModule {}
