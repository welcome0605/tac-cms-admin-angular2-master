import { Component, OnInit, ViewEncapsulation, AfterViewInit, ViewChild } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, NgForm } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';

import { CommonService } from './../../common.service';
import { CheckloginService } from './../../checklogin.service';
import { MessageService } from './../../message.service';
import { Observable } from 'rxjs/Observable';
import { DaterangepickerConfig } from 'ng2-daterangepicker';
import { DaterangePickerComponent } from 'ng2-daterangepicker';
import { concat } from 'rxjs/operators/concat';
import { setTimeout } from 'timers';


interface TransactionRes {
  email: string,
  first_name: string,
  last_name: string,
  st_amount: number,
  st_created: Date
  st_id: string,
  st_status: string
}

declare var $: any;
declare var jQuery: any;
declare var NProgress: any;
declare var swal: any;
declare var moment: any;

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class TransactionListComponent implements OnInit, AfterViewInit {

  private dataTable:any;
  resTabeData = [];
  resData = []
  public daterange: any = {};
  public singleDate: any;
  handleTimer: Observable<any>;
  array_of_date = [];
  sort_array_of_date = [];
  calendar_start = "";
  calendar_end = "";
  //jcr 416 
  is_access_app_operation = true;

  @ViewChild(DaterangePickerComponent)
  private picker: DaterangePickerComponent;
  // public options: any = {
  //   locale: { format: 'MM-DD-YYYY' },
  //   alwaysShowCalendars: false,
  // };
  constructor(private daterangepickerOptions: DaterangepickerConfig,
    private commonService: CommonService,
    private router: Router) {

    this.daterangepickerOptions.settings = {
      locale: { format: 'MM-DD-YYYY' },
      alwaysShowCalendars: false,
      ranges: {
        'Yesterday': [moment().add(-1, 'days')],
        'Last Week': [moment().subtract(1, 'week')],
        'Last Month': [moment().subtract(1, 'month'), moment()]
        // 'Last 3 Months': [moment().subtract(4, 'month'), moment()],
        // 'Last 6 Months': [moment().subtract(6, 'month'), moment()],
        // 'Last 12 Months': [moment().subtract(12, 'month'), moment()],
      },
    };

    this.handleTimer = Observable.timer(1000);

  }
  ngOnInit() {
    $("#mySidenav").css('display','none');
    // load API to retrive stripe transaction
    this.loadAllTrans();
  }
  // handler after view init
  ngAfterViewInit(): void {

  }

  private dtTransInit(): void {
    const buttonCommon = {
      exportOptions: {
        format: {
          body: function (data, row, column, node) {
            // console.log(data);
            return data;
          }
        }
      }
    }

    const handleDelay = Observable.timer(300);
    handleDelay.subscribe(() => {
      this.dataTable = $('#TransactionDatatable').DataTable({
        dom: 'Bfrtip',
        responsive: true,
        buttons: [
          $.extend(true, {}, buttonCommon, {
            extend: 'excel',
            text: '<i class="icmn-file-text2"></i>  Generate Report',
            title: 'Transaction Details',
            className: 'btn btn-md btn-excel',
          })
        ]
      });
    })

  }


  private loadAllTrans(): void {
    this.handleTimer.subscribe(() => {
      NProgress.start();
    })
    
    this.commonService.getData('getTransactionData').subscribe(res => {
      res = JSON.parse(res);
      if (res.status === 1 && res.data) {
        NProgress.done();
        
        res.data.forEach((d) => {
          this.array_of_date.push(d.timestamp);
          d.st_amount = '$' + d.st_amount / 100;
        });

        this.resData = res.data;
        
        let todayDate = new Date();

        todayDate.setHours(0);
        todayDate.setMinutes(0);
        todayDate.setSeconds(0);
        todayDate = new Date(todayDate.valueOf() - 30*24*60*60*1000);

        this.resData.forEach((d) => {                
          if(todayDate.valueOf() <= moment(d['timestamp']).valueOf()){
            this.resTabeData.push(d);
          }
        });

        this.handleTimer.subscribe(() => {
          NProgress.done()
        });

        setTimeout(()=> {
          let pickerDate = new Date();
          this.picker.datePicker.setStartDate(moment(pickerDate.valueOf() - 1000*60*60*24*30));
          this.picker.datePicker.setEndDate(moment(pickerDate.valueOf()));  
        }, 300);

      } else {
        this.resTabeData = [];
        this.handleTimer.subscribe(() => {
          NProgress.done()
        })
      }
      // call dt init
      this.dtTransInit();
      // console.log(this.rdata);
    });

  }
  /**
   * Method datepicker
   * @param value any
   * @param datepicker any
   */
  public selectedDate(value: any, datepicker?: any) {
    // // this is the date the iser selected
    // $('#TransactionDatatable').dataTable().fnPageChange('first', 1);
    datepicker.start = value.start;
    datepicker.end = value.end;

    this.dataTable.destroy();
    
    this.resTabeData = [];

    const sd = value.start.startOf('day').valueOf();
    const ed = value.end.endOf('day').valueOf();

    this.resData.forEach((d) => {      
      const checkDate = moment(d['timestamp']).valueOf();
      if(checkDate >= sd && checkDate <= ed)
        this.resTabeData.push(d);      
    });

    this.dtTransInit();

  }

}
