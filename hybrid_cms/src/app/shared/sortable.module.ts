import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';  
import { BrowserModule } from '@angular/platform-browser';

import { SortableColumnComponent } from '../structure/components/sortable-column.component';
import { SortableTableDirective } from '../structure/directive/sortable-table.directive';
import { SortService } from '../sort.service';

@NgModule({
  declarations: [ 
  	SortableColumnComponent,
    SortableTableDirective
  ],
  imports: [
  	CommonModule,
  	BrowserModule
  ],
  exports: [ 
  	SortableColumnComponent,
    SortableTableDirective
  ],
  providers: [
  	SortService
  ]
})
export class SortableModule {}