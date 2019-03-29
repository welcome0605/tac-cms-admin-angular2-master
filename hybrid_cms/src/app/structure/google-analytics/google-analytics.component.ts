import { Component, OnInit, ViewEncapsulation, AfterViewInit, ViewChild, EventEmitter } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, NgForm } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';

import { CommonService } from './../../common.service';
import { CheckloginService } from './../../checklogin.service';
import { MessageService } from './../../message.service';
import { GADataService } from './ga-chart-data.service';
import { Observable } from 'rxjs/Observable';
import { DaterangepickerConfig } from 'ng2-daterangepicker';
import { DaterangePickerComponent } from 'ng2-daterangepicker';
import { concat } from 'rxjs/operators/concat';
import { setTimeout } from 'timers';
import { AppSessionGraphComponent } from './app-session-graph.component';
import { FeatureVisitGraphComponent } from './feature-visit-graph.component';
import { AppDownloadGraphComponent } from './app-download-graph.component';

import { GoogleChart } from 'angular2-google-chart/directives/angular2-google-chart.directive';

declare var moment: any;
declare var NProgress: any;
declare var $: any;
declare var jQuery: any;
declare var swal: any;


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
  selector: 'google-anayltics',
  templateUrl: './google-analytics.component.html',
  styleUrls: ['./google-analytics.css'],
})

export class GoogleAnalyticsComponent implements OnInit, AfterViewInit {

  private dataTable:any;
  resTabeData = [];
  resData = [];
  public daterange: any = {};
  public singleDate: any;
  handleTimer: Observable<any>;
  array_of_date = [];
  sort_array_of_date = [];
  calendar_start = "";
  calendar_end = "";
  is_access_app_operation = true;
  @ViewChild(DaterangePickerComponent)
  private picker: DaterangePickerComponent;
  // public options: any = {
  //   locale: { format: 'MM-DD-YYYY' },
  //   alwaysShowCalendars: false,
  // };

  // public is_loading_average_time = true;
  // public is_loading_devices = true;
  // public is_loading_language = true;
  public is_loading_map = true;
  public sel_date:any;

  @ViewChild(AppSessionGraphComponent)
  private appSessionGraph: AppSessionGraphComponent;

  @ViewChild(FeatureVisitGraphComponent)
  private featureVisitGraph: FeatureVisitGraphComponent;

  @ViewChild(AppDownloadGraphComponent)
  private appDownloadGraph: AppDownloadGraphComponent;

  //map chart
  public map_ChartData = [
    // ['Country', 'Popularity']
    // ['GM', 200],
    // ['US', 300],
    // ['Brazil', 400],
    // ['Canada', 500],
    // ['France', 600],
    // ['RU', 700]
  ];
  public map_ChartOptions = {};
 

  constructor(
    private daterangepickerOptions: DaterangepickerConfig,
    private commonService: CommonService,
    private gaDataServce:GADataService,
    private router: Router
  ) {

    let curYearDate = new Date();
    curYearDate.setMonth(0);
    curYearDate.setDate(1);

    let curMonthDate = new Date();
    curMonthDate.setDate(1);

    let lastMonthDate = moment().subtract(1, 'month');    
    let lastMonthDateLast = new Date(lastMonthDate.years(), lastMonthDate.month()+1, 0);
    lastMonthDate.date(1);
    
    this.daterangepickerOptions.settings = {
      locale: { format: 'MM-DD-YYYY' },
      alwaysShowCalendars: false,
      ranges: {
        'Last 7 Days': [moment().subtract(1, 'week')],
        'Month To Date': [moment(curMonthDate)],
        'Year To Date': [moment(curYearDate), moment()],
        'Last Month': [lastMonthDate, moment(lastMonthDateLast)]
      },
    };

    this.handleTimer = Observable.timer(1000);
    this.sel_date = [moment().subtract(30, 'day'), moment()];
    setTimeout(()=>{
      this.picker.datePicker.setStartDate(moment().subtract(30, 'day'));
      this.picker.datePicker.setEndDate(moment());  
    }, 300);

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
    this.appDownloadGraph.getDownloadData(this.sel_date);
    this.appSessionGraph.getAppSessionData(this.sel_date);
    this.featureVisitGraph.getEventData(this.sel_date);
    this.getWorldDownloadCount(this.sel_date);
  }
  // handler after view init
  ngAfterViewInit(): void {

  }

  private loadAllTrans(): void {
    this.handleTimer.subscribe(() => {
      NProgress.start();
    })    
  }
  /**
   * Method datepicker
   * @param value any
   * @param datepicker any
   */
  public selectedDate(value: any, datepicker?: any) {
    datepicker.start = value.start;
    datepicker.end = value.end;

    this.sel_date = [value.start, value.end];
    // this.gaDataServce.emit(selDate);   
    
    this.appDownloadGraph.getDownloadData(this.sel_date);
    this.appSessionGraph.getAppSessionData(this.sel_date);
    this.featureVisitGraph.getEventData(this.sel_date);
    this.getWorldDownloadCount(this.sel_date);
  }

  public changeASDevice(event) {
    this.appSessionGraph.getAppSessionData(this.sel_date);
  }

  public changeFVDevice(event) {
    this.featureVisitGraph.getEventData(this.sel_date);
  }

  public onSelect(event){

  }

  public getAndroidDownloadCount(){    
    return this.appDownloadGraph.chart_data[1]['value'];
  }

  public getiOSDownloadCount() {
    return this.appDownloadGraph.chart_data[0]['value'];
  }

  public getWorldDownloadCount(data_array) {
    this.is_loading_map = true;
    let downloadFormData = new FormData();
    const appData = this.commonService.get_current_app_data();

    let from_date = "" + data_array[0].year() +"-"+(data_array[0].month()+1) +"-"+ data_array[0].date();
    let to_date = "" + data_array[1].year() +"-"+(data_array[1].month()+1) +"-"+ data_array[1].date()
    // let platform_str = 'ios';
    // if(this.platform_kind == 2)
    //   platform_str = 'android';

    const reqData = {
      'app_id':appData.id,
      'from_date':from_date, 
      'to_date':to_date,
      // 'platform':platform_str
    }

    this.commonService.postData(reqData, 'analytics/get_country_count').subscribe(res => {
      let rdata = JSON.parse(res);
      this.is_loading_map = false;
      this.map_ChartData = [];

      if (rdata.status == 1) {
        this.map_ChartData.push(['Country', 'Download']);
        let countries = Object.keys(rdata.data);        

        for(let i = 0; i < countries.length; i++ ) {
          this.map_ChartData.push([countries[i],rdata.data[countries[i]]]);
        }
     
        // let message = rdata.message;
        $(function () {
          $.notify({
            title: '',
            message: "Get CountryDownload Data successed."
          }, {
              type: 'success'
            });
        });
      } else {
        $(function () {
          $.notify({
            title: '',
            message: "Getting CountryDownload Data Failed."
          }, {
              type: 'warning'
            });
        });
      }
    })
  }
}