import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './../../auth.guard';

import { SharedService } from './../../shared.service';
import { TransactionListComponent } from './transaction-list.component';
import { Daterangepicker } from 'ng2-daterangepicker';
import { CapitalizePipe } from './../../capitalize.pipe';
import { TransactionTimePipePipe } from './../../transaction-time-pipe.pipe';
import { SubscriptionListComponent } from './subscription-list.component'

export const routes: Routes = [
  { path: 'transaction-list', component: TransactionListComponent, canActivate: [AuthGuard] },
  { path: 'subscription-list', component: SubscriptionListComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    RouterModule.forChild(routes),
    Daterangepicker
  ],
  declarations: [
    TransactionListComponent,
    CapitalizePipe,
    TransactionTimePipePipe,
    SubscriptionListComponent
  ],

  providers: [SharedService]

})
export class TransactionListModule { }
