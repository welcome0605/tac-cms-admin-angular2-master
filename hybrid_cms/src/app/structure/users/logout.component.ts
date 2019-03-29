import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { CommonService } from './../../common.service';
import { CheckloginService } from './../../checklogin.service';
declare var $: any;
declare var jQuery: any;


@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styles: []
})

export class LogoutComponent implements OnInit {

  //jcr 416
  // is_access_app_operation = true;
  
  constructor(private commonService: CommonService, private checkloginService: CheckloginService, private router: Router)
  {
    //jcr 416
		// this.commonService.check_user_token_valid().subscribe(res => {
		// 	if(res == false) {
		// 	  this.router.navigate(['sign-in']);
		// 	} else {
		// 	  const currentuserdata = this.commonService.get_user_data();
		// 	  const userRole = currentuserdata.role_id;
		// 	  if (userRole !== 1) {
		// 		this.is_access_app_operation = false;
		// 	  }
		// 	}
		//   });
  }

  ngOnInit() {

    this.logout();

  }

  logout(): void {
        localStorage.removeItem('currentUser');
        this.checkloginService.emit_logout();
        this.router.navigate(['/sign-in']);
    }
}
