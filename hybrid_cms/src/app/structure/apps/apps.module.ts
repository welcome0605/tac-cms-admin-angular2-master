import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './../../auth.guard';

import { AppsCreateComponent } from './create.component';
import { AppsScreenComponent } from './screen.component';
import { SharedService } from './../../shared.service';
import { ColorPickerModule } from 'ngx-color-picker';
import { AppStartupConfigComponent } from './app-startup-config.component';
import { AppStyleConfigComponent } from './app-style-config.component';
import { CanDeactivateGuardService } from './../../can-deactivate-guard.service';
import { MenuModule } from './../menu/menu.module';


export const routes: Routes = [
  {
    path: 'apps/create',
    component: AppsCreateComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'apps/screen',
    component: AppsScreenComponent,
    canActivate: [AuthGuard],
    canDeactivate: [CanDeactivateGuardService]
  },
  {
    path: 'apps/startup-configuration',
    component: AppStartupConfigComponent,
    canActivate: [AuthGuard],
    canDeactivate: [CanDeactivateGuardService]
  },
  {
    path: 'apps/style-configuration',
    component: AppStyleConfigComponent,
    canActivate: [AuthGuard],
    canDeactivate: [CanDeactivateGuardService]
  }

];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    HttpClientModule,
    MenuModule,
    ColorPickerModule,
    RouterModule.forChild(routes),
  ],
  declarations: [
    AppsCreateComponent,
    AppsScreenComponent,
    AppStartupConfigComponent,
    AppStyleConfigComponent
  ],
  providers: [SharedService]

})

export class AppsModule { }
