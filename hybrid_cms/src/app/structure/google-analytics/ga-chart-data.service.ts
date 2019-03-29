import { Component, EventEmitter, Injectable } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import { CommonService } from './../../common.service';

@Injectable()
export class GADataService {
  datachange: EventEmitter<Array<any>> = new EventEmitter();
  is_access_app_operation = true;
  constructor(
    private router: Router,
    private commonService: CommonService,
  ) 
  {
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
  emit(aryDate) {
    this.datachange.emit(aryDate);
  }
  subscribe(component, callback) {
    // set 'this' to component when callback is called
    return this.datachange.subscribe(data => callback(component, data));
  }
}