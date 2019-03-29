import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { CommonService } from './../../common.service';
import { CheckloginService } from './../../checklogin.service';
import { MessageService } from './../../message.service';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';

declare var $: any;
declare var jQuery: any;
declare var swal: any;
declare var NProgress: any

@Component({
  selector: 'app-cms-user',
  templateUrl: './cms-user.component.html',
  styles: []
})
export class CmsUserComponent implements OnInit, OnDestroy {
  public form = {
    'value': {
      'id': ''
    }
  };

  rdata = [];
  appUserAssignData = [];
  usersData = [];
  is_error = false;
  error_message = '';
  success_message = '';
  is_success = false;
  flag: boolean;
  handleTimer: Observable<any>;
  is_access_app_operation: boolean = true;

  constructor(private commonService: CommonService, private checkloginService: CheckloginService, private router: Router) {

    this.handleTimer = Observable.timer(1000);

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

  // initDatatable(): void {
  //   const handleDelay = Observable.timer(100)
  //   handleDelay.subscribe(() => {
  //     $('#usersTemplateDatatable').DataTable({ responsive: true });
  //   })
  // }
  initDatatable(): void {
    const handleDelay = Observable.timer(100)
    handleDelay.subscribe(() => {
      if( this.flag == false) {
        console.log('*********false');
        console.log(this.flag);
        return;
      }
      $('#usersTemplateDatatable').DataTable({ responsive: true });
      console.log('*********true');
      console.log(this.flag);
    })
  }  

  ngOnDestroy() {
    this.flag = false;
  }

  ngOnInit() {
    $("#mySidenav").css('display','none');
    this.commonService.isAuthorizedRoute();
    this.flag = true;
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
    this.handleTimer.subscribe(() => {
      NProgress.start();
    });
    //gjc0407
    // this.commonService.getData('fetchAllCMSUsersData').subscribe(res => {
      this.commonService.getData('fetchAllUser').subscribe(res => {
      this.rdata = JSON.parse(res);
      // console.log(this.rdata);
      // console.log('=======================================');
      //2018-1-20
      this.usersData = this.rdata['data'];
      // console.log(this.usersData);
      // for (var i=0; i<this.usersData.length; i++) {
      //   if (this.usersData[i]['invoice'] == null || this.usersData[i]['invoice']['data'] == null) {
      //     this.usersData[i]['pay'] = false;
      //     break;
      //   }
      //   for (var j=0; j<this.usersData[i]['invoice']['data'].length; j++) {
      //     if(this.usersData[i]['invoice']['data'][j]['paid'] == false) {
      //       this.usersData[i]['pay'] = false;
      //       break;
      //     }
      //   }
      // }
      ////////////
      
      this.initDatatable();
      
      this.handleTimer.subscribe(() => {
        NProgress.done();
      });
    },
      error => {
        this.rdata = JSON.parse(error._body);
        this.is_error = true;
        this.is_success = false;
        this.error_message = this.rdata['message'];
        this.handleTimer.subscribe(() => {
          NProgress.done();
        });
      }
    );

  }

  deleteUser(id) {
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
          self.deleteUserData(id);
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

  deleteUserData(id) {
    this.form.value.id = id;
    this.commonService.postData(this.form.value, 'deleteUser').subscribe(res => {
      this.rdata = JSON.parse(res);
      this.is_success = true;
      this.is_error = false;
      

      // this.usersData = this.usersData.filter(user => {
      //   return user.id != id;
      // })

      const table = $('#usersTemplateDatatable').DataTable();
      
      table.rows(`tr#user_${id}`).remove().draw();
      // table.destroy();
      // setTimeout(() => {
      //   $('#usersTemplateDatatable').DataTable({
      //     responsive: true
      //   });
      // }, 1000);

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
