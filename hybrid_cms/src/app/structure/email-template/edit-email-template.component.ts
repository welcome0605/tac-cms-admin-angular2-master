import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { FormBuilder, FormGroup, Validators, FormControl, NgForm } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { TopBarService } from '../../components/top-bar/top-bar.service';
import { CommonService } from './../../common.service';
import { CheckloginService } from './../../checklogin.service';
import { MessageService } from './../../message.service';

declare var $: any;
declare var jQuery: any;

@Component({
  selector: 'app-edit-email-template',
  templateUrl: './edit-email-template.component.html',
  styles: []
})
export class EditEmailTemplateComponent implements OnInit {
  public cform: FormGroup;
  rdata = [];
  success_message = '';
  is_success = false;
  is_error = false;
  error_message =  '';
  bodyText = "";
  editId = '';
  rstatus = '';

   //jcr 416
   is_access_app_operation = true;

  statusArray = [
    {
      "name": "Active",
      "key": 1
    },
    {
      "name": "In Active",
      "key": 2
    }
  ];
  editIdArray = {
    'value': {
      'id':''
    }
  };
  constructor(private commonService: CommonService,
    private fb: FormBuilder, private router: Router,
    private linkValue: ActivatedRoute,
    private alarmServce:TopBarService)
  {
    this.commonService.isAuthorizedRoute();
    this.editId = this.linkValue.snapshot.params.id;
    
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
    $("#mySidenav").css('display','none');
    this.cform = this.fb.group({
      et_name: [null, Validators.compose([Validators.required])],
      et_subject: [null, Validators.compose([Validators.required])],
      et_body: [null, Validators.compose([Validators.required])],
      status: [null, Validators.compose([Validators.required])]
    });

    this.editIdArray.value.id = this.editId;
    this.commonService.postData(this.editIdArray.value,'fetchEmailTemplateById').subscribe(res =>
    {
      this.rdata = JSON.parse(res);
      this.is_success = true;
      this.is_error = false;
      this.bodyText = this.rdata['et_body'];

      $(function() {
        $('#summernote').summernote({
          height: 200
        });
      });

      this.cform = this.fb.group({
        et_name: [this.rdata['et_name'], Validators.compose([Validators.required])],
        et_subject: [this.rdata['et_subject'], Validators.compose([Validators.required])],
        et_body: [this.rdata['et_body'], Validators.compose([Validators.required])],
        status: [this.rdata['status'], Validators.compose([Validators.required])]
      });
      
      //gjc service
      this.alarmServce.countEmail();
    });

  }

  onSubmit(form: NgForm)
  {
    let text = $('#summernote').summernote('code');
    form.value.et_body = text;
    form.value.id = this.rdata['id'];

    this.commonService.postData(form.value,'updateEmailTemplate').subscribe(res =>
    {
      this.rdata = JSON.parse(res);
      this.rstatus = this.rdata['status'];
      if(this.rstatus == '1')
      {
        this.is_success = true;
        this.is_error = false;
        form.resetForm();
        this.success_message = this.rdata['message'];
        this.commonService.storeMessage(this.success_message);
        this.router.navigate(['/email-template']);
      }
      else
      {
        let error_message = this.rdata['message'];
          $(function() {
           $.notify({
            title: '',
            message: error_message
          },{
            type: 'danger'
          });
        });
      }

    },
    error => {
      this.rdata = JSON.parse(error._body);
      this.is_error = true;
      this.is_success = false;
      this.error_message = this.rdata['message'];
      let error_message = this.rdata['message'];
        $(function() {
          $.notify({
            title: '',
            message: error_message
        },{
          type: 'danger'
        });
      });
    }

    );

  }

}
