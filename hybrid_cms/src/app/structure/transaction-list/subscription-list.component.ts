import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, NgForm } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';

import { CommonService } from './../../common.service';
import { CheckloginService } from './../../checklogin.service';
// import { MessageService } from './../../message.service';
import { Observable } from 'rxjs/Observable';
import { DaterangePickerComponent, DaterangepickerConfig } from 'ng2-daterangepicker';
import { stagger } from '@angular/animations/src/animation_metadata';
import { setTimeout } from 'timers';
import { Router } from '@angular/router';

declare var NProgress: any;
declare var $: any;
declare var jQuery: any;
declare var swal: any;
declare var moment: any;

@Component({
  selector: 'app-subscription-list',
  templateUrl: './subscription-list.component.html',
  styleUrls: ['./subscription-list.component.css']
})
export class SubscriptionListComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild(DaterangePickerComponent)
  private picker: DaterangePickerComponent;

  resDataSub = [];
  rdataSub = [];
  daterange: any = {};
  singleDate: any;
  array_of_date = [];
  sort_array_of_date = [];
  calendar_start = "";
  calendar_end = "";
  //jcr 416
  is_access_app_operation = true;
  
  private dataTable:any;
  handleTimer: Observable<any>;
  // see original project for full list of options
  // can also be setup using the config service to apply to multiple pickers
  options: any = {
    locale: { format: 'MM-DD-YYYY' },
    alwaysShowCalendars: false,
  };

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
      }
    };
    this.singleDate = Date.now();    
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

  ngOnInit() {
    $("#mySidenav").css('display','none');
    this.loadallsub();
  }
  ngAfterViewInit(): void {
    // 2018-2-16
    // const a = new Date();
    // const thisYear = (new Date()).getFullYear();
    // const start = new Date('1/1/' + thisYear);
    // const defaultStart = moment(start.valueOf());

    // this.picker.datePicker.setStartDate(defaultStart);
    // this.picker.datePicker.setEndDate(Date.now());
  }

  ngOnDestroy(): void {
    // if spinner isActive then
    // console.log('OnDestroy')
    // this.dataTable.destroy();
    // this.messageService.setSpinnerActive(false);
  }
  /**
   * Method to init subsctiption datatable jquery
   */
  private dtSubsInit(): void {
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
      this.dataTable = $('#SubscriptionDatatable').DataTable({
        dom: 'Bfrtip',
        responsive: true,
        order:[9, "asc"],
        buttons: [
          $.extend(true, {}, buttonCommon, {
            extend: 'excel',
            text: '<i class="icmn-file-text2"></i>  Generate Report',
            title: 'Subscription Details',
            className: 'btn btn-md btn-excel',
          })
        ]
      });
    })
  }
  /**
   * API Call to load all subsctiption data
   */
  private loadallsub(): void {

    this.handleTimer.subscribe(() => {
      NProgress.start();
    })

    if (this.commonService.subscriptionGetter() === undefined) {

      // this.messageService.setSpinnerActive({
      //   active: true,
      //   text: 'This process will take some time to finish. Please DO NOT leave the page and wait until it finishes.'
      // })
     
      this.commonService.getData('getSubscriptionData').subscribe(res => {
        res = JSON.parse(res);
        if (res.status === 1 && res.data) {
          
          let todayDate = new Date();          

          todayDate.setHours(0);
          todayDate.setMinutes(0);
          todayDate.setSeconds(0);
          todayDate = new Date(todayDate.valueOf() - 30*24*60*60*1000);

          let selDate;
          res.data.forEach((d) => {
            if(todayDate.valueOf() <= moment(d['timestamp']).valueOf()){
              let obj = d;
              for(let i=0; i<obj.invoice.data.length; i++){
                selDate = moment(obj.invoice.data[i].date);
                obj.invoice.data[i].date = "" + selDate.years()
                  +"-"+this.get2DigiNumber((selDate.months()+1))
                  +"-"+this.get2DigiNumber(selDate.date())
                  +" "+this.get2DigiNumber(selDate.hours())
                  +":"+this.get2DigiNumber(selDate.minutes())
                  +":"+this.get2DigiNumber(selDate.seconds());                      
                }
                this.rdataSub.push(obj);                            
              }
            }
          );

          this.resDataSub = res.data;

          this.commonService.subscrptionSetter(res.data);

          setTimeout(()=>{
            let pickerDate = new Date();
            this.picker.datePicker.setStartDate(moment(pickerDate.valueOf() - 1000*60*60*24*30));
            this.picker.datePicker.setEndDate(moment(pickerDate.valueOf()));  
          }, 300);

          this.handleTimer.subscribe(() => {
            NProgress.done()
          });

        } else {
          this.rdataSub = [];
          this.handleTimer.subscribe(() => {
            NProgress.done()
          })
        }
        // call datatable init
        this.dtSubsInit();
        // this.messageService.setSpinnerActive(false);

      });
    } else {
      // call datatable init      
      var resData = this.commonService.subscriptionGetter();

      var today_Date = new Date();               
      today_Date.setHours(0);
      today_Date.setMinutes(0);
      today_Date.setSeconds(0);
      today_Date = new Date(today_Date.valueOf() - 30*24*60*60*1000);
      
      var selDate;
      resData.forEach((d) => {
        if(today_Date.valueOf() <= moment(d['timestamp']).valueOf()){
          var obj = d;
          for(var i=0; i < d['invoice']['data'].length; i++){
            selDate = moment(d['invoice']['data'][i].date);
            d['invoice']['data'][i].date = "" + selDate.years()
              +"-"+this.get2DigiNumber((selDate.months()+1))
              +"-"+this.get2DigiNumber(selDate.date())
              +" "+this.get2DigiNumber(selDate.hours())
              +":"+this.get2DigiNumber(selDate.minutes())
              +":"+this.get2DigiNumber(selDate.seconds());                      
          }
          this.rdataSub.push(obj);
        }
      });


      setTimeout(() => {
        var pickerDate = new Date();
        this.picker.datePicker.setStartDate(moment(pickerDate.valueOf() - 1000*60*60*24*30));
        this.picker.datePicker.setEndDate(moment(pickerDate.valueOf()));  
      }, 300);

      this.dtSubsInit();      
      this.resDataSub = resData;
      
      
      this.handleTimer.subscribe(() => {
        NProgress.done()
      })

    
    }
  }
  /**
  * Method datepicker for subscription
  * @param value any
  * @param datepicker any
  */
  public selectedDate_sub(value: any, datepicker?: any) {

    // this is the date the iser selected    
    datepicker.start = value.start;
    datepicker.end = value.end;
    // or manipulate your own internal property
    this.daterange.start = value.start;
    this.daterange.end = value.end;
    this.daterange.label = value.label;
    
    this.dataTable.destroy();

    this.rdataSub = [];

    const sd = value.start.startOf('day').valueOf();
    const ed = value.end.endOf('day').valueOf();

    let selDate;
    this.resDataSub.forEach((d) => {      
      const checkDate = moment(d['timestamp']).valueOf();
      if(checkDate >= sd && checkDate <= ed){
        let obj = d;
        for(let i=0; i<obj.invoice.data.length; i++){
          selDate = moment(obj.invoice.data[i].date);
          obj.invoice.data[i].date = "" + selDate.years()
            +"-"+this.get2DigiNumber((selDate.months()+1))
            +"-"+this.get2DigiNumber(selDate.date())
            +" "+this.get2DigiNumber(selDate.hours())
            +":"+this.get2DigiNumber(selDate.minutes())
            +":"+this.get2DigiNumber(selDate.seconds());                      
        }
        this.rdataSub.push(obj);      
      }
    });

    this.dtSubsInit();

  }

  public get2DigiNumber(nValue:any){
    return ("0" + nValue).slice(-2);
  }

}
