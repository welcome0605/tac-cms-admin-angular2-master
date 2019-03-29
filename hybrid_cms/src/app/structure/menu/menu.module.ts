import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';

import { AuthGuard } from './../../auth.guard';
import { CanDeactivateGuardService } from './../../can-deactivate-guard.service';
import { ColorPickerModule } from 'ngx-color-picker';
import { DomSanitizer } from '@angular/platform-browser';

import { SharedService } from './../../shared.service';
import { SafeHtmlPipe } from './safehtmlpipe.pipe';

import { MenuConfigurationComponent } from './menu-configuration.component';

import { MenuTypeMenuComponent } from './menu-types/menu-type-menu.component';
import { MenuTypeIframeComponent } from './menu-types/menu-type-iframe.component';
import { MenuTypeNotificationComponent } from './menu-types/menu-type-notification.component';

import { MenuTypePdfComponent } from './menu-types/menu-type-pdf.component';
import { MenuTypePhotoComponent } from './menu-types/menu-type-photo.component';
import { MenuTypeRssComponent } from './menu-types/menu-type-rss.component';
import { MenuTypeTutorialComponent } from './menu-types/menu-type-tutorial.component';
import { MenuTypeVideoComponent } from './menu-types/menu-type-video.component';
import { MenuTypeYoutubeVideoComponent } from './menu-types/menu-type-youtube-video.component';
import { MenuTypeContentEditorComponent } from './menu-types/menu-type-content-editor.component';

import { ContentThemePickerComponent } from './menu-types/content-theme-picker/content-theme-picker.component';
import { TutorialMediumPickerComponent } from './menu-types/tutorial-medium-picker/tutorial-medium-picker.component';

import { MenuTypeWebsiteComponent } from './menu-types/menu-type-website.component';
import { MenuTypeListMenuComponent } from './menu-types/menu-type-list-menu.component';
import { MenuRecuTreeViewComponent } from './menu-recu-tree-view/menu-recu-tree-view.component';

import { MenuTypeContactComponent } from './menu-types/menu-type-contact.component';
import { MenuTypeRewardsComponent } from './menu-types/menu-type-rewards.component';

import { ScrollNestableDirective } from './../directive/scroll-nestable.directive';
import { OnlyNumDirective } from './../directive/only-num.directive';
import { AllowValidUrlDirective } from './../directive/allow-valid-url.directive';
import { AllowValidEmailDirective } from './../directive/allow-valid-email.directive';
import { MenupipePipe } from './../../menupipe.pipe';
// import { MasonryLayoutDirective } from 'ngx-masonry-layout/components';
export const routes: Routes = [
  {
    path: 'menu-configuration',
    component: MenuConfigurationComponent,
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
    ColorPickerModule,
    FroalaEditorModule.forRoot(), 
    FroalaViewModule.forRoot(),
    RouterModule.forChild(routes)
  ],
  declarations: [
    SafeHtmlPipe,
    MenuConfigurationComponent,
    MenuTypeMenuComponent,
    MenuTypeIframeComponent,
    MenuTypeNotificationComponent,
    MenuTypePdfComponent,
    MenuTypePhotoComponent,
    MenuTypeRssComponent,
    MenuTypeTutorialComponent,
    MenuTypeVideoComponent,
    MenuTypeWebsiteComponent,
    MenuTypeYoutubeVideoComponent,
    MenuTypeContentEditorComponent,
    MenuTypeListMenuComponent,
    MenuRecuTreeViewComponent,
    ScrollNestableDirective,
    OnlyNumDirective,
    AllowValidUrlDirective,
    AllowValidEmailDirective,
    MenupipePipe,
    MenuTypeContactComponent,
    MenuTypeRewardsComponent,
    ContentThemePickerComponent,
    TutorialMediumPickerComponent
    // MasonryLayoutDirective
  ],
  providers: [SharedService],
  exports: [ScrollNestableDirective, OnlyNumDirective, AllowValidUrlDirective, AllowValidEmailDirective]

})

export class MenuModule { }
