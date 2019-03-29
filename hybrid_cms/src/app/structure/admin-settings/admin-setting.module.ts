import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './../../auth.guard';

import { SharedService } from './../../shared.service';
import { AdminSettingComponent } from './admin-setting.component';
import { CanDeactivateGuardService } from './../../can-deactivate-guard.service';



export const routes: Routes = [
  { path: 'admin-setting', component: AdminSettingComponent,
   canActivate: [AuthGuard],
   canDeactivate: [CanDeactivateGuardService]  }
];


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    RouterModule.forChild(routes),
  ],

  declarations: [
    AdminSettingComponent
  ],

  providers: [SharedService]

})

export class AdminSettingModule { }
