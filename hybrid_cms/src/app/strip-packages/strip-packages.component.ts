import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { PricingRes, API_GET_PACKAGES, PricingsubRes } from './pricing';

import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

@Component({
  selector: 'app-strip-packages',
  templateUrl: './strip-packages.component.html',
  styleUrls: ['./strip-packages.component.css']
})
export class StripPackagesComponent implements OnInit {

  packagesList: any;

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
    this.loadStripPackages();
  }
  /**
   * Method to get active packages list
   */
  loadStripPackages(): void {

    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    this.http.get<PricingRes>(API_GET_PACKAGES, { headers: headers })
      .subscribe(res => {
        this.packagesList = res.data;
      });
  }
  /**
   * Method to set active plan as selected package and redirect to sign-up page
   * @param data : PricingsubRes
   */
  openHandler(data: PricingsubRes): void {
    localStorage.setItem('active_plan', JSON.stringify(data));
    this.router.navigate(['/sign-up']);
  }
}
