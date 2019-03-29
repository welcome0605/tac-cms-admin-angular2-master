import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StripPackagesComponent } from './strip-packages.component';
import { HttpClientModule } from '@angular/common/http';
import { Routes, RouterModule } from '@angular/router';


export const routes: Routes = [
  { path: 'plans', component: StripPackagesComponent },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    StripPackagesComponent
  ]
})
export class StripPackagesModule { }
