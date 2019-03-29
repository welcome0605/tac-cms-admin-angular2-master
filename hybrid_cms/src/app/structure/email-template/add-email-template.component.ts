import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { FormBuilder, FormGroup, Validators, FormControl, NgForm } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';

import { CommonService } from './../../common.service';
import { CheckloginService } from './../../checklogin.service';
import { MessageService } from './../../message.service';

declare var $: any;
declare var jQuery: any;

@Component({
  selector: 'app-add-email-template',
  templateUrl: './add-email-template.component.html',
  styles: []
})
export class AddEmailTemplateComponent implements OnInit {
  public form: FormGroup;
  @ViewChild('addEmailTempBtn') addEmailTempBtnRef : ElementRef; 
  rdata = [];
  success_message = '';
  is_success = false;
  is_error = false;
  error_message =  '';
  rstatus = '';
  editId = '';

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

  constructor(private commonService: CommonService, private fb: FormBuilder, private router: Router, private linkValue: ActivatedRoute)
  {
    this.commonService.isAuthorizedRoute();

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
    $(function() {
        $('#et_body').summernote({
          height: 200
        // placeholder: 'write here...'
        });
    });

    this.form = this.fb.group({
      et_name: [null, Validators.compose([Validators.required])],
      et_subject: [null, Validators.compose([Validators.required])],
      // et_body: [null, Validators.compose([Validators.required])],
      status: [1, Validators.compose([Validators.required])]
    });

  }

  onSubmit(form: NgForm)
  {
    let text = $('#et_body').summernote('code');
    form.value.et_body = text;
    this.addEmailTempBtnRef.nativeElement.disabled = true;
    this.commonService.postData(form.value,'addEmailTemplate').subscribe(res =>
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
        this.addEmailTempBtnRef.nativeElement.disabled = false;
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
        this.addEmailTempBtnRef.nativeElement.disabled = false;
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
      this.addEmailTempBtnRef.nativeElement.disabled = false;
    }

    );

  }

}
