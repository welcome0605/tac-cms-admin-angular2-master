import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, NgForm } from '@angular/forms';

import { CommonService } from './../../common.service';
declare var $: any;
declare var jQuery: any;

@Component({
  selector: 'cat-page',
  templateUrl: './create.component.html'
})

export class AppsCreateComponent implements OnInit {
	public form: FormGroup;
  rdata = [];
  storeData = [];
  rstatus = '';
	constructor(private commonService: CommonService, private fb: FormBuilder) {
    
  }
  ngOnInit() {
    $("#mySidenav").css('display','');
  	this.form = this.fb.group({
      app_name: ['', Validators.compose([Validators.required])]
    });
  }
  onSubmit(form: NgForm) {

    this.commonService.postData(form.value,'createapp').subscribe(res =>
    {
       this.rdata = JSON.parse(res);
       this.rstatus = this.rdata['status'];
        if(this.rstatus == '1')
        {
          form.resetForm();
           let success_message = this.rdata['message'];
           $(function() { 
             $.notify({
              title: '',
              message: success_message
            },{
              type: 'success'
            });
           });
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
    });
  }
}

