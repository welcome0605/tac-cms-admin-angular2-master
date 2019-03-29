import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { PricingRes, API_GET_PACKAGES, PricingsubRes } from './pricing';

import { Observable } from 'rxjs/Observable';
import { CommonService } from './../../common.service';
import 'rxjs/Rx';

@Component({
  selector: 'app-strip-packages',
  templateUrl: './strip-packages.component.html',
  styleUrls: ['./strip-packages.component.css']
})
export class StripPackagesComponent implements OnInit {

  packagesList: any;
  //jcr 416
  is_access_app_operation = true;

  constructor(private http: HttpClient,
    private router: Router,
    private cS: CommonService,
    private commonService: CommonService) 
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

  ngOnInit() {
    this.loadStripPackages();
  }
  loadStripPackages() {

    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    this.http.get<PricingRes>(API_GET_PACKAGES, { headers: headers })
      .subscribe(res => {
        this.packagesList = res.data;
        // console.log(res);
      });
  }
  openHandler(data: PricingsubRes) {

    this.cS.setBasicPlan(data);
    this.router.navigate(['/sign-up']);

  }


}
