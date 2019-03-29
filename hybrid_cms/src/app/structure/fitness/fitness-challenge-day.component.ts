import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { CommonService } from './../../common.service';
import { CheckloginService } from './../../checklogin.service';
import { MessageService } from './../../message.service';

declare var $: any;
declare var jQuery: any;
declare var swal: any;

@Component({
	selector: 'app-fitness-challenge-day',
	templateUrl: './fitness-challenge-day.component.html',
	styleUrls: []
})
export class FitnessChallengeDayComponent implements OnInit 
{
	public form = {
      'value': {
        'id':''
      }
  	};
	fitnessDayData = '';
	rdata = [];
	is_error = false;
	error_message =  '';
	success_message = '';
	is_success = false;
	id = '';
	//jcr416
	is_access_app_operation = true;

	constructor(private commonService: CommonService, private checkloginService: CheckloginService, private router: Router) 
	{ 
		this.commonService.isAuthorizedRoute(); 
		this.commonService.getData('fetchAllFitnessChallengeDay').subscribe(res =>
		{
			this.rdata = JSON.parse(res);
			this.fitnessDayData = this.rdata['data'];
		},
		error => {
			this.rdata = JSON.parse(error._body);
			this.is_error = true;
			this.is_success = false;
			this.error_message = this.rdata['message'];
		}
		);
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

	ngOnInit() 
	{
		$(function()
		{
	      $(document).on('click', '.alert-close', function() {
	        $('.alert-close').hide();
	      });

	      setTimeout(() => {
	        $('#fitnessDatatable').DataTable({
	          responsive: true
	        });
	      },1000);

	    });
	}
	deleteFitnessDay(id)
	{
		var self = this;

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
		function(isConfirm)
		{
			if (isConfirm)
			{
				self.form.value.id = id;
				self.commonService.postData(self.form.value,'deleteFitnessChallengeDay').subscribe(res =>
				{
					self.rdata = JSON.parse(res);
					self.fitnessDayData = self.rdata['data'];
					self.is_success = true;
					self.is_error = false;
					var table = $('#fitnessDatatable').DataTable();
					table.destroy();
					setTimeout(() => {
						$('#fitnessDatatable').DataTable({
							responsive: true
						});
					},1000);
					self.success_message = self.rdata['message'];
				},
				error => {
					self.rdata = JSON.parse(error._body);
					self.is_error = true;
					self.is_success = false;
					self.error_message = self.rdata['message'];
				}
				);
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

}
