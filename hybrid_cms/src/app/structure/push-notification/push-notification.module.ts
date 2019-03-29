import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './../../auth.guard';

import { SharedService } from './../../shared.service';
import { PushNotificationComponent } from './push-notification.component';
import { CanDeactivateGuardService } from './../../can-deactivate-guard.service';

import { ColorPickerModule } from 'ngx-color-picker';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { BrowserModule  } from '@angular/platform-browser';
import {NgxPaginationModule} from 'ngx-pagination';
import {NgPipesModule} from 'ngx-pipes';
import { Pipe, PipeTransform } from '@angular/core';

export const routes: Routes = [
  { path: 'push-notification', component: PushNotificationComponent,
   canActivate: [AuthGuard],
   canDeactivate: [CanDeactivateGuardService]  }
];

@Pipe({
  name: 'reverse'
})

@NgModule({

  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    RouterModule.forChild(routes),
    ColorPickerModule,
    BrowserModule,
    Ng2SearchPipeModule,
    NgxPaginationModule,
    NgPipesModule
  ],

  declarations: [
    PushNotificationComponent
  ],

  providers: [SharedService]

})

export class PushNotificationModule { }
export class ReversePipe implements PipeTransform {

  transform(value) {
    if (!value) return;

    return value.reverse();
  }
}
