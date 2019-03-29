import { Component, EventEmitter, Injectable } from '@angular/core';
import { CommonService } from './../../common.service';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class TopBarService {

  alarmchange: EventEmitter<Array<any>> = new EventEmitter();
  myMethod$: Observable<any>;
  cntEmail$: Observable<any>;
  cntTicket$: Observable<any>;

  private myMethodSubject = new Subject<any>();
  private cntUnreadTicket = new Subject<any>();
  private cntUnreadEmail  = new Subject<any>();

  constructor(private commonService: CommonService) {
    this.myMethod$  = this.myMethodSubject.asObservable();
    this.cntEmail$  = this.cntUnreadEmail.asObservable();
    this.cntTicket$ = this.cntUnreadTicket.asObservable();
  }

  cars = [
    'Ford','Chevrolet','Buick'
  ];

  myData() {
    return 'This is my data, man!';
  }

  myMethod(data) {
    console.log(data); // I have data! Let's return it so subscribers can use it!
    // we can do stuff with data if we want
    this.myMethodSubject.next(data);
  }

  countTicket(){
    this.commonService.getData('unreadTickets').subscribe(res => {
			let rdata = JSON.parse(res)['data'];
      // this.cntUnreadTicket = rdata.length;
      this.cntUnreadTicket.next(rdata);
    });
  }

  countEmail(){
		this.commonService.getData('fetchAllEmailTemplate').subscribe(res => {
			let rdata = JSON.parse(res)['data'].filter(email => {
				return email.readable == 0;
			});
      //this.cntUnreadEmail = rdata.length;
      this.cntUnreadEmail.next(rdata.length);
		});
  }

  // emit(aryDate) {
  //   this.alarmchange.emit(aryDate);
  // }

  // subscribe(component, callback) {
  //   // set 'this' to component when callback is called
  //   //return this.alarmchange.subscribe(data => callback(component, data));
  //   return "hello";
  // }
}
