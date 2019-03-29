import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './../../auth.guard';
import { CanDeactivateGuardService } from './../../can-deactivate-guard.service';

import { UserSignInComponent } from './user-sign-in.component';
import { LogoutComponent } from './logout.component';
import { ForgotPasswordComponent } from './forgot-password.component';
import { OtpFormComponent } from './otp-form.component';
import { UserSignUpComponent } from './user-sign-up.component';
import { ProfileComponent } from './profile.component';
import { PrivacyPolicyComponent } from './privacy-policy.component';
import { TermsComponent } from './terms.component';
import { MenuModule } from './../menu/menu.module';
import { ShowHideModuleModule } from './../show-hide-container/show-hide-module.module';

export const routes: Routes = [

  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard], canDeactivate: [CanDeactivateGuardService] },

  { path: 'sign-in', component: UserSignInComponent },
  { path: 'sign-up', component: UserSignUpComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'otp', component: OtpFormComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  { path: 'terms', component: TermsComponent },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    MenuModule,
    ShowHideModuleModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    UserSignInComponent,
    ForgotPasswordComponent,
    OtpFormComponent,
    UserSignUpComponent,
    ProfileComponent,
    LogoutComponent,
    PrivacyPolicyComponent,
    TermsComponent
  ]

})

export class UsersModule { }
