import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from './../../common.service';
declare var $: any;
@Component({
  selector: 'app-rewards',
  templateUrl: './rewards.component.html',
  styleUrls: ['./rewards.component.css']
})

export class RewardsComponent implements OnInit {
  navLinks: any[];
  activeLinkIndex = 0;
  //jcr 416
  is_access_app_operation = true;  

  constructor(
    private router: Router,
    private commonService: CommonService) {
    this.navLinks = [
      {
        label: 'Settings',
        path: '/rewards/setting',
        icon: 'icmn-database',
        index: 0
      },
      {
        label: 'Rewards',
        path: '/rewards/index',
        icon: 'icmn-coin-dollar',
        index: 1
      },
      {
        label: 'Redemptions',
        path: '/rewards/redemption',
        icon: 'icmn-loop2',
        index: 2
      },
      {
        label: 'Check Ins',
        path: '/rewards/checkin',
        icon: 'icmn-cloud-check',
        index: 3
      },
      {
        label: 'Staff',
        path: '/rewards/staff',
        icon: 'icmn-user-tie',
        index: 4
      },
      {
        label: 'Manage Members',
        path: '/rewards/member',
        icon: 'icmn-users',
        index: 5
      },
      {
        label: 'Modified Transactions',
        path: '/rewards/modified-transaction',
        icon: 'icmn-shuffle',
        index: 6
      },
    ];
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
    this.activeLinkIndex = this.navLinks.indexOf(
      this.navLinks.slice().reverse().find(tab => (this.router.url).includes(tab.path))
    ); 
    this.router.events.subscribe((res) => {
      this.activeLinkIndex = this.navLinks.indexOf(
        this.navLinks.slice().reverse().find(tab => (this.router.url).includes(tab.path))
      );
    });
    // $('.mat-ink-bar').attr('style','background: #0190fe !important');
  }

}