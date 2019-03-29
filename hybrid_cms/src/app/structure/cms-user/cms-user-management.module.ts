import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './../../auth.guard';

import { SharedService } from './../../shared.service';
import { CmsUserComponent } from './cms-user.component';
import { AddUserComponent } from './add-user.component';
import { EditUserComponent } from './edit-user.component';
import { AppManagementComponent } from './app-management.component';
import { ShowHideModuleModule } from './../show-hide-container/show-hide-module.module';
import { CanDeactivateGuardService } from './../../can-deactivate-guard.service';

export const routes: Routes = [
  { path: 'users', component: CmsUserComponent, canActivate: [AuthGuard] },
  { path: 'user/add', component: AddUserComponent, canActivate: [AuthGuard] },
  { path: 'user/edit/:id', component: EditUserComponent, canActivate: [AuthGuard], canDeactivate: [CanDeactivateGuardService] },
  { path: 'app-management', component: AppManagementComponent, canActivate: [AuthGuard] }
];

@NgModule({

  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    ShowHideModuleModule,
    RouterModule.forChild(routes)
  ],

  declarations: [
    CmsUserComponent,
    AddUserComponent,
    EditUserComponent,
    AppManagementComponent
  ],

  providers: [SharedService]

})

export class CmsUserManagementModule { }
