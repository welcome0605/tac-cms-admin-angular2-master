import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { Dashboard } from './dashboard.page';
import { TrashAppComponent } from './trash-app.component';
import { AuthGuard } from './../../auth.guard';
import { SharedService } from './../../shared.service';

export const routes: Routes = [
  { path: 'dashboard', component: Dashboard, canActivate: [AuthGuard] },
  { path: 'trash-app', component: TrashAppComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    Dashboard,
    TrashAppComponent
  ],
  providers: [SharedService]

})

export class DashboardModule { }
