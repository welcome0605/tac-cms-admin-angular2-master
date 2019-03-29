import { Component, Injectable, Input, Output, EventEmitter } from '@angular/core'


@Injectable()
export class SharedService {
  @Output() fireappdata: EventEmitter<string> = new EventEmitter<string>();

  getAppDataEmittedValue() {
    return this.fireappdata;
  }

  emit_appdata(data) {
    this.fireappdata.emit(data);
  }

}
