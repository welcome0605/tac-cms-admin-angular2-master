import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { CommonService } from './../../common.service';
import { CheckloginService } from './../../checklogin.service';
import { MessageService } from './../../message.service';

declare var $: any;
declare var jQuery: any;
declare var swal: any;
declare var NProgress: any;

@Component({
  selector: 'app-email-template',
  templateUrl: './email-template.component.html',
  styleUrls: []
})

export class EmailTemplateComponent implements OnInit {

  public form = {
    'value': {
      'id': ''
    }
  };
  emailTemaplateData: any;
  rdata = [];
  is_error = false;
  error_message = '';
  success_message = '';
  is_success = false;
  id = '';
  //416 jcr
  is_access_app_operation = true;
  handleTimer: Observable<any>;

  constructor(private commonService: CommonService, private checkloginService: CheckloginService, private router: Router) {
    this.commonService.isAuthorizedRoute();
    // init observable timer
    this.handleTimer = Observable.timer(1000);
    // var test = this.router.navigate(['/product-details', id]);
    // jcr 416
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
    const handleDelay = Observable.timer(800)
    handleDelay.subscribe(() => {
      $('#emailTemplateDatatable').DataTable({ responsive: true });
    })
  }

  ngOnInit() {
    $("#mySidenav").css('display','none');
    $(function () {
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
    // fetch all templates
    this.fetchAllEmailTemplates();


  }
  /**
   * Fetch all EMAIL Templates API
   */
  fetchAllEmailTemplates(): void {
    this.handleTimer.subscribe(() => {
      NProgress.start();
    })
    let mUnreadEmail = 0;
    this.commonService.getData('fetchAllEmailTemplate').subscribe(res => {
      this.rdata = JSON.parse(res);
      this.emailTemaplateData = this.rdata['data'];
      this.handleTimer.subscribe(() => {
        NProgress.done();
        for(let i=0; i < this.emailTemaplateData.length; i++)
        {
          if(this.emailTemaplateData[i].readable == 0){
            mUnreadEmail ++;
          }
        }
        if(mUnreadEmail != 0){
          const alram_message = "There are "+mUnreadEmail+" unread emails.";
          $(function () {
            $.notify({
              title: '',
              message: alram_message
            }, {
                type: 'success'
              });
          });
        }
      })
      this.initDatatable();

    }, error => {
      this.rdata = JSON.parse(error._body);
      this.is_error = true;
      this.is_success = false;
      this.error_message = this.rdata['message'];
    }
    );

    var interval = setInterval(() => {
      let mUnreadEmail = 0;
      this.commonService.check_user_token_valid().subscribe(res => {
        if (res == false) {
          clearInterval(interval);
        } else {
          this.commonService.getData('fetchAllEmailTemplate').subscribe(res => {
            this.rdata = JSON.parse(res);
            this.emailTemaplateData = this.rdata;
            if(this.emailTemaplateData.length == 0){
            }
            else{
              for(let i=0; i < this.emailTemaplateData.length; i++)
              {
                if(this.emailTemaplateData[i].state == 2){
                  mUnreadEmail ++;
                }
              }
              if(mUnreadEmail != 0){
                const alram_message = "There are "+mUnreadEmail+" unread emails.";
                $(function () {
                  $.notify({
                    title: '',
                    message: alram_message
                  }, {
                      type: 'success'
                    });
                });
              }
            }
          });
        }
      })
      
    }, 120000);
  }

  deleteEmailtemp(id) {
    this.form.value.id = id;
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
      function (isConfirm) {
        if (isConfirm) {
          self.deleteTemplateData(id);
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

  deleteTemplateData(id) {
    this.form.value.id = id;
    this.commonService.postData(this.form.value, 'deleteEmailTemplate').subscribe(res => {
      this.rdata = JSON.parse(res);
      this.emailTemaplateData = this.rdata['data'];
      this.is_success = true;
      this.is_error = false;
      const table = $('#emailTemplateDatatable').DataTable();
      table.destroy();
      setTimeout(() => {
        $('#emailTemplateDatatable').DataTable({
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

