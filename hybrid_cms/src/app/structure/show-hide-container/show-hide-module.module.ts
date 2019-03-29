import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { importType } from '@angular/compiler/src/output/output_ast';

import { ShowHideContainerComponent } from './show-hide-container.component';
@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ShowHideContainerComponent],
  exports: [ShowHideContainerComponent]
})
export class ShowHideModuleModule { }
