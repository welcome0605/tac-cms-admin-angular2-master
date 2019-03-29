import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './../../auth.guard';
import { MatTabsModule } from '@angular/material';
import { ContactComponent } from './contact.component';
import { ContactmsgModule } from './contactmsg/contactmsg.module';
import { BrowserModule } from '@angular/platform-browser';
// import { ContactmsgComponent } from './contactmsg/contactmsg.component';
import { PagerService } from './pagi/index';


// export const routes: Routes = [
//   { path: 'contact-us', component: ContactComponent, canActivate: [AuthGuard] },
// ];
export const routes: Routes = [
  { path: 'contact-us', component: ContactComponent, canActivate: [AuthGuard],
    // children: [
    //   {
    //     path: 'contact-msg', component: ContactmsgComponent
    //   }
    // ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ContactmsgModule,
    //RouterModule.forChild(routes)
    RouterModule.forChild(routes),
    BrowserModule,
    HttpModule
  ],
  providers: [
    PagerService
  ],
  declarations: [
    ContactComponent,
    // ContactmsgComponent
  ],
  bootstrap: [ContactComponent]
  ////
})
export class ContactModule { }