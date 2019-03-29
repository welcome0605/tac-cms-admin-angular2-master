import { Component, Injectable, Input, Output, EventEmitter } from '@angular/core'


@Injectable()
export class CheckloginService {
  @Output() fire: EventEmitter<boolean> = new EventEmitter<boolean>();

  emit_login() {
    this.fire.emit(true);
  }
  emit_logout() {
    this.fire.emit(false);
  }
  getEmittedValue() {
    return this.fire;
  }

}
