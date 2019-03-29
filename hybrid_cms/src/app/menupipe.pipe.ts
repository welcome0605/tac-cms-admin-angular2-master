import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'menupipe'
})
export class MenupipePipe implements PipeTransform
{
  a: any;
  transform(value: any, args?: any): any
  {
    if (value.length <= 34) {
      this.a = value;
    } else {
      this.a = value.substring(0, 34) + '...';
    }
    return this.a;
  }

}
