import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { CommonService } from './../../../common.service';
import { S3Service } from './../../../s3.service';
import { Router} from '@angular/router';

declare var $: any;
declare var jQuery: any;
declare var swal: any;
declare var NProgress: any;

@Component({
    selector: 'app-bonus',
    templateUrl: './bonus.component.html',
    styleUrls: ['./bonus.component.css']
})
export class BonusComponent implements OnInit { 
	public form = {
		'value': {
		  'id': ''
		}
	}; 

	rdata = [];
	active_bonuses: any[] = []; 
	inactive_bonuses: any[] = [];
	is_error = false;
	error_message = '';
	success_message = '';
	is_success = false;
	appId: string;

	handleTimer: Observable<any>;
	//jcr 416
	is_access_app_operation = true;

	constructor(
		private commonService: CommonService,
		private s3Service: S3Service,
		private router: Router
	) {
		this.commonService.isAuthorizedRoute();
		this.handleTimer = Observable.timer(1000);
	}

	initDatatable(): void {
		const handleDelay = Observable.timer(100);
		handleDelay.subscribe(() => {
			$('#BonusDatatable').DataTable({ responsive: true });
		})
	}

	getBonuses() {
		this.handleTimer.subscribe(() => {
			NProgress.start();
		});
		this.commonService.postData({'app_id': this.appId}, 'fetchAllBonuses').subscribe(res => {
				let bonuses = JSON.parse(res)['data'];
				this.active_bonuses = bonuses.filter(bonus => bonus.active == 1);
				this.inactive_bonuses = bonuses.filter(bonus => bonus.active == 0);
				
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
		this.getBonuses();
	}

	activateBonus(id) {
		this.handleTimer.subscribe(() => {
			NProgress.start();
		});
		this.commonService.postData({id: id, active: 1}, 'updateBonus').subscribe(res => {
			let bonuses = JSON.parse(res)['data'];
			this.active_bonuses = bonuses.filter(bonus => bonus.active == 1);
			this.inactive_bonuses = bonuses.filter(bonus => bonus.active == 0);
			
			this.handleTimer.subscribe(() => {
				NProgress.done();
			});
			const table = $('#bonusesDatatable').DataTable();
			table.destroy();
			setTimeout(() => {
				$('#bonusesDatatable').DataTable({
				  responsive: true
				});
			}, 1000);
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

	deactivateBonus(id) {
		this.handleTimer.subscribe(() => {
			NProgress.start();
		});
		this.commonService.postData({id: id, active: 0}, 'updateBonus').subscribe(res => {
			let bonuses = JSON.parse(res)['data'];
			this.active_bonuses = bonuses.filter(bonus => bonus.active == 1);
			this.inactive_bonuses = bonuses.filter(bonus => bonus.active == 0);
			
			this.handleTimer.subscribe(() => {
				NProgress.done();
			});
			const table = $('#bonusesDatatable').DataTable();
			table.destroy();
			setTimeout(() => {
				$('#bonusesDatatable').DataTable({
				  responsive: true
				});
			}, 1000);
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

	deleteBonus(id) {
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
	          self.deleteBonusData(id);
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

	

	deleteBonusData(id) {
		this.commonService.postData({'app_id': this.appId, 'id': id}, 'deleteBonus').subscribe(res => {
		  	let bonuses = JSON.parse(res)['data'];
		  	this.active_bonuses = bonuses.filter(bonus => bonus.active == 1);
			this.inactive_bonuses = bonuses.filter(bonus => bonus.active == 0);

			this.is_success = true;
			this.is_error = false;
			const table = $('#bonusesDatatable').DataTable();
			table.destroy();
			setTimeout(() => {
				$('#bonusesDatatable').DataTable({
				  responsive: true
				});
			}, 1000);
			
			this.s3Service.deleteFileByUrl(JSON.parse(res)['s3_url']);

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
