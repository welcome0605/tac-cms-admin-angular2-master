import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, Http} from '@angular/http';
import { Routes, RouterModule }  from '@angular/router';
import { AuthGuard } from './../../auth.guard';

import { SharedService } from './../../shared.service';
import { SuperAdminSettingComponent } from './super-admin-setting.component';


export const routes: Routes = [
  { path: 'super-admin-setting', component: SuperAdminSettingComponent, canActivate: [AuthGuard] }
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
    SuperAdminSettingComponent
  ],

  providers:[SharedService]

})

export class SuperAdminSettingModule { }
