import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './../../auth.guard';

import { VersionManagementComponent } from './version-management.component';
// import { SpinnerComponentComponent } from './spinner-component/spinner-component.component';



export const routes: Routes = [

  { path: 'version-management', component: VersionManagementComponent, canActivate: [AuthGuard] },

];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    VersionManagementComponent,
  //  SpinnerComponentComponent
  ]

})

export class VersionManagementModule { }
