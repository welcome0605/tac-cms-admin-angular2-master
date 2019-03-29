import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalize'
})
export class CapitalizePipe implements PipeTransform {

  transform(value: any, args?: any): any {

    if (value) {
      return value.replace(/\b\w/g, first => first.toLocaleUpperCase());
    }
    return value;
  }

}
