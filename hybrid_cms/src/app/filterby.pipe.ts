import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'filter_by'
})
export class FilterByPipe implements PipeTransform {
  transform(items: any[], args: any): any {
  	
  	for (let key in args) {
  		if (args.hasOwnProperty(key)) {
  			items = items.filter(item => item.key == args[key]);	
  		}
  	}
  	return items;
  }
}