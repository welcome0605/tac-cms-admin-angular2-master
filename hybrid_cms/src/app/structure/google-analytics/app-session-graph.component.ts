
import {Component} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import { GADataService } from './ga-chart-data.service';
import { CommonService } from './../../common.service';
import { Observable } from 'rxjs/Observable';
//jcr 416
import { Router, ActivatedRoute } from '@angular/router';

declare var $: any;
declare var jQuery: any;

@Component({
  selector: 'app-session-graph',
  template: `
  <ngx-charts-line-chart
    [scheme]="colorScheme"
    [results]="chart_data"
    [gradient]="gradient"
    [xAxis]="showXAxis"
    [yAxis]="showYAxis"
    [legend]="showLegend"
    [showXAxisLabel]="showXAxisLabel"
    [showYAxisLabel]="showYAxisLabel"
    [xAxisLabel]="xAxisLabel"
    [yAxisLabel]="yAxisLabel"
    (select)="onSelect($event)">
  </ngx-charts-line-chart>
  `,
  styles:[``]
})

export class AppSessionGraphComponent {

  view: any[] = [700, 400];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = false;
  showXAxisLabel = true;
  xAxisLabel = 'Daily';
  showYAxisLabel = false;
  yAxisLabel = '';
  is_loading_app_session = true;
  platform_kind = 1;
  //jcr 416
  is_access_app_operation = true;

  public chart_data = [
    {
      "name": "AppSession",
      "series": [        
      ]
    }
  ];


  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };
  
  subscription: any;
  constructor(
    private gaDataServce:GADataService,
    private commonService: CommonService,
    //jcr 416
    private router: Router) {
    this.subscription = this.gaDataServce.subscribe(this, this.changeData);
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
  
  changeData(curComponent,data_array: Array<any>) {
    curComponent.getAppSessionData(data_array);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onSelect(event){
    console.log("asdf");
  }
  
  getAppSessionData(data_array) {
    this.is_loading_app_session = true;
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

    this.commonService.postData(reqData, 'analytics/get_session_count').subscribe(res => {
      let rdata = JSON.parse(res);
      this.is_loading_app_session = false;
      this.chart_data = [];
      

      if (rdata.status == 1) {
        this.xAxisLabel = rdata.period;
        let dateKeys = Object.keys(rdata.data);
        let series = [];
        for(let i = 0; i < dateKeys.length; i++ ) {
          let dateJson = {};
          dateJson['name'] = dateKeys[i];
          dateJson['value'] = rdata.data[dateKeys[i]];
          series.push(dateJson);
        }
        
        this.chart_data = [
          {
            "name": "AppSession",
            "series": series
          }
        ];

        // let message = rdata.message;
        $(function () {
          $.notify({
            title: '',
            message: "Get Session Count successed."
          }, {
              type: 'success'
            });
        });
      } else {
        $(function () {
          $.notify({
            title: '',
            message: "Nothing exist Session Count."
          }, {
              type: 'warning'
            });
        });
      }
    })

  }
}

