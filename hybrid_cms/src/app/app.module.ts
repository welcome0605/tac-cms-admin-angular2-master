import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';

import { Router, NavigationStart, NavigationEnd, RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { routing } from './app.routing';

import { AppComponent } from './app.component';
// custome new Added:
import { CommonService } from './common.service';
import { MessageService } from './message.service';
import { S3Service } from './s3.service';
import { TopBarService } from '../app/components/top-bar/top-bar.service';

import { AuthGuard } from './auth.guard';
import { ColorPickerModule } from 'ngx-color-picker';
import { TopBarComponent } from './components/top-bar/top-bar.component';
import { MenuLeftComponent } from './components/menu-left/menu-left.component';
import { MenuRightComponent } from './components/menu-right/menu-right.component';
import { PreviewComponment } from './components/preview_bar/preview';

import { FooterComponent } from './components/footer/footer.component';
// import spinner component
import { SpinnerComponentComponent } from './structure/version/spinner-component/spinner-component.component';

import { StructureModule } from './structure/structure.module';
import { CanDeactivateGuardService } from './can-deactivate-guard.service';

declare var NProgress: any;

@NgModule({
  declarations: [
    AppComponent,
    TopBarComponent,
    MenuLeftComponent,
    MenuRightComponent,
    PreviewComponment,
    FooterComponent,
    SpinnerComponentComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    HttpClientModule,
    RouterModule,
    StructureModule,
    ColorPickerModule,
    NgbModule.forRoot(),
    routing,

  ],
  providers: [CommonService, AuthGuard, CanDeactivateGuardService, MessageService, S3Service, TopBarService],
  bootstrap: [AppComponent],
})

export class AppModule {
  constructor(private router: Router) {
    router.events.subscribe((event) => {

      if (event instanceof NavigationStart) {
        NProgress.start();
      }

      if (event instanceof NavigationEnd) {
        // setTimeout(function () {
        //   NProgress.done();
        // }, 200);
        NProgress.done();
      }

    });
  }
}
