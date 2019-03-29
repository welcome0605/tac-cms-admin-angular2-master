import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './../../../auth.guard';
import { ContactmsgComponent } from './contactmsg.component';

export const routes: Routes = [
  { path: 'contact-us/contact-msg', component: ContactmsgComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    ContactmsgComponent
  ]
})
export class ContactmsgModule { }
