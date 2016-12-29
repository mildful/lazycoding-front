import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DotModule } from './dot/dot.module';
import { OverlayModule } from './overlay/overlay.module';

@NgModule({
  imports: [ CommonModule ],
  exports: [ CommonModule, DotModule, OverlayModule ]
})
export class SharedModule { }
