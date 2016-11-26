import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DotModule } from './dot/dot.module';

@NgModule({
  imports: [ CommonModule ],
  exports: [ CommonModule, DotModule ]
})
export class SharedModule { }
