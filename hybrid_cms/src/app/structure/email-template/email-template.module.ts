import { NgModule }      from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, Http} from '@angular/http';
import { CommonModule }  from '@angular/common';
import { Routes, RouterModule }  from '@angular/router';
import { AuthGuard } from './../../auth.guard';

import { EmailTemplateComponent } from './email-template.component';
import { AddEmailTemplateComponent } from './add-email-template.component';
import { EditEmailTemplateComponent } from './edit-email-template.component';


export const routes: Routes = [

  { path: 'email-template', component: EmailTemplateComponent, canActivate: [AuthGuard] },
  { path: 'email-template/add', component: AddEmailTemplateComponent, canActivate: [AuthGuard] },
  { path: 'email-template/edit/:id', component: EditEmailTemplateComponent, canActivate: [AuthGuard] },

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
    EmailTemplateComponent,
    AddEmailTemplateComponent,
    EditEmailTemplateComponent
  ]

})

export class EmailTemplateModule { }
