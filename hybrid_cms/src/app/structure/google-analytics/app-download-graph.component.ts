
import {Component} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import { GADataService } from './ga-chart-data.service';
import { CommonService } from './../../common.service';
import { Observable } from 'rxjs/Observable';

declare var $: any;
declare var jQuery: any;

@Component({
  selector: 'app-download-graph',
  template: `
            <ngx-charts-pie-chart            
              [scheme]="colorScheme"
              [results]="chart_data"
              [legend]="showLegend"
              [explodeSlices]="explodeSlices"
              [labels]="showLabels"
              [doughnut]="doughnut"
              [gradient]="gradient"
              (select)="onSelect($event)">
            </ngx-charts-pie-chart>          
          `,
  styles:[``]
})

export class AppDownloadGraphComponent {

  // options
  showLabels = false;
  explodeSlices = false;
  doughnut = false;
  showLegend = false;
  is_loading_app_type = true;

  public chart_data = [
    {
      "name": "iOS",
      "value": 0
    },
    {
      "name": "Android",
      "value": 0
    }
  ];

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };
  
  subscription: any;
  constructor(
    private gaDataServce:GADataService,
    private commonService: CommonService ) {
    this.subscription = this.gaDataServce.subscribe(this, this.changeData);
  }
  
  changeData(curComponent,data_array: Array<any>) {
    // console.log('item index changed!', data_array);
    // curComponent = data_array;
    curComponent.getDownloadData(data_array);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onSelect(event){
    
  }
  
  getDownloadData(data_array) {
    this.is_loading_app_type = true;
    let downloadFormData = new FormData();
    const appData = this.commonService.get_current_app_data();
    // downloadFormData.append('app_id', appData.id);
    // downloadFormData.append('from_date', "" + data_array[0].year() +"-"+data_array[0].month() +"-"+ data_array[0].date());
    // downloadFormData.append('to_date', "" + data_array[1].year() +"-"+data_array[1].month() +"-"+ data_array[1].date());

    let from_date = "" + data_array[0].year() +"-"+(data_array[0].month()+1) +"-"+ data_array[0].date();
    let to_date = "" + data_array[1].year() +"-"+(data_array[1].month()+1) +"-"+ data_array[1].date()
    const reqData = {'app_id':appData.id,'from_date':from_date, 'to_date':to_date}

    this.commonService.postData(reqData, 'analytics/get_installed_count').subscribe(res => {
      let rdata = JSON.parse(res);
      this.is_loading_app_type = false;
      if (rdata.status == 1) {
        this.chart_data = [
              {
                "name": "iOS",
                "value": rdata.ios_count
              },
              {
                "name": "Android",
                "value": rdata.android_count
              }
        ]
        // NProgress.done();
        $(function () {
          $.notify({
            title: '',
            message: "Getting AppType Download Data Successed."
          }, {
              type: 'success'
            });
        });
      } 
      else {
        $(function () {
          $.notify({
            title: '',
            message: "Getting AppType Data Failed."
          }, {
              type: 'warning'
            });
        });
      }
    })

  }
}

