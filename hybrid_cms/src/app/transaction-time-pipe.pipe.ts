import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'transactionTimePipe'
})
export class TransactionTimePipePipe implements PipeTransform {
  finalDate: any;
  transform(value: any, args?: any): any {

    const a = value.split(' ');

    if (a[1].substring(0, 1) == 0) {
      this.finalDate = a[0] + ' ' + a[1].substring(1, 7) + ' ' + a[2];
      return this.finalDate;
    } else {
      this.finalDate = a[0] + ' ' + a[1] + ' ' + a[2]
      return this.finalDate;
    }

  }

}
