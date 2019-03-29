import { Component, OnInit, OnDestroy } from '@angular/core';

import { CommonService } from './common.service';
import { SharedService } from './shared.service';
import { Location } from '@angular/common';
import { CheckloginService } from './checklogin.service';
import { MessageService } from './message.service';
import { AuthGuard } from './auth.guard';
import { Subscription } from 'rxjs/Subscription';
import { inspect } from 'util';
import { Router} from '@angular/router';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: [],
  providers: [CheckloginService]
})
export class AppComponent implements OnInit, OnDestroy {


  is_login = false;
  excluded_route = ['sign-in', 'sign-up', 'forgot-password'];
  current_location = '';
  // jcr 416
  is_access_app_operation = true;
  is_app_name = false;
  select_app_data = [];

  private isActiveSpinner: boolean;
  private spinnerSubscriber: Subscription;
  private spinnerMsg: string;

  constructor(private checkloginService: CheckloginService,
    private mS: MessageService,
    private commonService: CommonService,
    private sharedService: SharedService,
    private location: Location,
    private router: Router) {

    let current_route = location.path();
    current_route = current_route.replace(/\//g, '');
    this.current_location = current_route;

    // this.isActiveSpinner = true;
    // set spinning msg
    const spinnerString = 'This process will take some time to finish. Please DO NOT leave the page and wait until it finishes.';

    this.checkloginService.getEmittedValue().subscribe(
      title => {
        this.is_login = title;
      }
    );

    if (this.commonService.is_login()) {
      this.is_login = true;
    }

    // todo msg
    this.spinnerSubscriber = this.mS.getSpinnerActive().subscribe(d => {
      // console.log(d instanceof Object, d, typeof (d) === 'boolean')
      if (d instanceof Object) {
        this.isActiveSpinner = d.active;
        this.spinnerMsg = d.text;
      } else if (typeof (d) === 'boolean') {
        this.isActiveSpinner = d;
        this.spinnerMsg = spinnerString;
      }

    })
    //jcr 416
		this.commonService.check_user_token_valid().subscribe(res => {
			if(res == false) {
			  this.router.navigate(['sign-in']);
			} else {
			  const currentuserdata = this.commonService.get_user_data();
			  const userRole = currentuserdata.role_id;
			  if (userRole !== 1) {
				this.is_access_app_operation = false;
			  }
			}
		  });
  }

  ngOnInit() {
    this.select_app_data = this.commonService.get_current_app_data();
    if (this.select_app_data) {
      this.is_app_name = true;
    }

    this.sharedService.getAppDataEmittedValue().subscribe(
      title => {
        if (title) {
          this.select_app_data = title;
          this.is_app_name = true;  
        } else {
          this.select_app_data = null;
          this.is_app_name = false;
        }
        
      }
    );
  }

  ngOnDestroy(): void {
    this.spinnerSubscriber.unsubscribe();
  }


}
