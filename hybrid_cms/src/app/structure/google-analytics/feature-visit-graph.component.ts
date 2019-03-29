
import {Component} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import { GADataService } from './ga-chart-data.service';
import { CommonService } from './../../common.service';
import { Observable } from 'rxjs/Observable';

declare var $: any;
declare var jQuery: any;

@Component({
  selector: 'feature-visit-graph',
  template: `
  <ngx-charts-bar-vertical  
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
  </ngx-charts-bar-vertical>
  `,
  styles:[``]
})

export class FeatureVisitGraphComponent {

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = false;
  showXAxisLabel = false;
  xAxisLabel = '';
  showYAxisLabel = false;
  yAxisLabel = '';
  is_loading_app_feature = true;
  platform_kind = 1;

  chart_data = [
    // {
    //   "name": "Germany",
    //   "value": 8940000
    // },
    // {
    //   "name": "USA",
    //   "value": 5000000
    // },
    // {
    //   "name": "France",
    //   "value": 7200000
    // }
  ];

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };
  
  subscription: any;
  constructor(
    private gaDataServce:GADataService,
    private commonService: CommonService) {
    this.subscription = this.gaDataServce.subscribe(this, this.changeData);
  }
  changeData(curComponent,data_array: Array<any>) {
    console.log('item index changed!', data_array);
    // this.chart_data = data_array;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onSelect(event){
    console.log("asdf");
  }

  getEventData(data_array) {
    this.is_loading_app_feature = true;
    let downloadFormData = new FormData();
    const appData = this.commonService.get_current_app_data();

    let from_date = "" + data_array[0].year() +"-"+(data_array[0].month()+1) +"-"+ data_array[0].date();
    let to_date = "" + data_array[1].year() +"-"+(data_array[1].month()+1) +"-"+ data_array[1].date()
    // let platform_str = 'android';
    // if(this.platform_kind == 1)
    //   platform_str = 'ios';

    const reqData = {
      'app_id':appData.id,
      'from_date':from_date, 
      'to_date':to_date,
      // 'platform':platform_str
    }

    this.commonService.postData(reqData, 'analytics/get_event_count').subscribe(res => {
      let rdata = JSON.parse(res);
      this.is_loading_app_feature = false;
      if (rdata.status == 1) {

        this.chart_data = [];

        let dateKeys = Object.keys(rdata.data);
        for(let i = 0; i < dateKeys.length; i++ ) {
          let dateJson = {};
          dateJson['name'] = dateKeys[i];
          dateJson['value'] = rdata.data[dateKeys[i]];
          this.chart_data.push(dateJson);
        }
        let message = rdata.message;
        $(function () {
          $.notify({
            title: '',
            message: "Get vist count successed."
          }, {
              type: 'success'
            });
        });
      } else {
        let message = rdata.message;
        $(function () {
          $.notify({
            title: '',
            message: "Nothing exist vist count"
          }, {
              type: 'warning'
            });
        });
      }
    })

  }

  
}

