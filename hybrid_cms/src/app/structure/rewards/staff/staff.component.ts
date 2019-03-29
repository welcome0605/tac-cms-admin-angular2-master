import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import { CommonService } from './../../../common.service';
import { Observable } from 'rxjs/Observable';

import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import { Router } from '@angular/router';

declare var $: any;
declare var jQuery: any;
declare var swal: any;
declare var NProgress: any;

@Component({
    selector: 'app-staff',
    templateUrl: './staff.component.html',
    styleUrls: []
})
export class StaffComponent implements OnInit {
	public form = {
		'value': {
		  'id': ''
		}
	}; 

	rdata = [];
	appUserAssignData = [];
	staffs: any[];
	is_error = false;
	error_message = '';
	success_message = '';
	is_success = false;
	appId: string;
	//jcr 416
	is_access_app_operation = true;
	
	handleTimer: Observable<any>;

	constructor(
		private commonService: CommonService,
	  private router: Router) {
		this.commonService.isAuthorizedRoute();
		this.handleTimer = Observable.timer(1000);
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

	initDatatable(): void {
		const handleDelay = Observable.timer(100);
		handleDelay.subscribe(() => {
			$('#staffsDatatable').DataTable({ responsive: true });
		})
	}

	export() {
		new Angular2Csv(this.staffs, 'export_staffs_' + Date() + '.csv'); 
	}

	getStaffs(){
		this.handleTimer.subscribe(() => {
			NProgress.start();
		});
		this.commonService.postData({'app_id': this.appId}, 'fetchAllStaffs').subscribe(res => {
				this.staffs = JSON.parse(res)['data'];
				this.staffs.map(staff => staff.name = (staff.first_name ? staff.first_name + ' ' : '') + (staff.last_name ? staff.last_name : ''));
				this.handleTimer.subscribe(() => {
					NProgress.done();
				});
				this.initDatatable();
			}, error => {
				this.rdata = JSON.parse(error._body);
		        this.is_error = true;
		        this.is_success = false;
		        this.error_message = this.rdata['message'];
		        this.handleTimer.subscribe(() => {
		          NProgress.done();
		        });
			});
	}

	ngOnInit(){
		this.appId = JSON.stringify(this.commonService.get_current_app_data().id);
		$("#mySidenav").css('display','none');
		this.commonService.isAuthorizedRoute();

		$(function () {
		  // Handle error message
		  $(document).on('click', '.alert-close', function () {
		    $('.alert-close').hide();
		  });
		});

		if (this.commonService.isMessage()) {
		  const success_message = this.commonService.getMessage();
		  $(function () {
		    $.notify({
		      title: '',
		      message: success_message
		    }, {
		        type: 'success'
		      });
		  });
		  this.commonService.removeMessage();
		}
		this.getStaffs();
	}

	deleteStaff(id) {
		this.form.value.id = id;
	    const self = this;

	    swal({
	      title: "Are you sure?",
	      text: "You will not be able to recover this record",
	      type: "warning",
	      showCancelButton: true,
	      confirmButtonClass: "btn-danger",
	      confirmButtonText: "Yes, remove it",
	      cancelButtonText: "Cancel",
	      closeOnConfirm: false,
	      closeOnCancel: true
	    },
	      function (isConfirm) {
	        if (isConfirm) {
	          self.deleteStaffData(id);
	          swal({
	            title: "Deleted!",
	            text: "Your record has been deleted.",
	            type: "success",
	            confirmButtonClass: "btn-success"
	          });
	        } else {
	          swal({
	            title: "Cancelled",
	            text: "Your record is safe :)",
	            type: "error",
	            confirmButtonClass: "btn-danger"
	          });
	        }
	      });
	}

	deleteStaffData(id) {
		this.commonService.postData({'app_id': this.appId, 'id': id}, 'deleteStaff').subscribe(res => {
		  	this.staffs = JSON.parse(res)['data'];
			this.staffs.map(staff => staff.name = (staff.first_name ? staff.first_name : '') + (staff.last_name ? staff.last_name : ''));
			this.is_success = true;
			this.is_error = false;
			const table = $('#staffsDatatable').DataTable();
			table.destroy();
			setTimeout(() => {
				$('#staffsDatatable').DataTable({
				  responsive: true
				});
			}, 1000);
			this.success_message = this.rdata['message'];
		},
		  error => {
		    this.rdata = JSON.parse(error._body);
		    this.is_error = true;
		    this.is_success = false;
		    this.error_message = this.rdata['message'];
		  }
		);
	}
}
