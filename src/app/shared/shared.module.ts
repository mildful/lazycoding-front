import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DotModule } from './dot/dot.module';
import { OverlayModule } from './overlay/overlay.module';
import { WindowRef } from './window-ref';

@NgModule({
  imports: [ CommonModule ],
  exports: [ CommonModule, DotModule, OverlayModule ],
  providers: [ WindowRef ]
})
export class SharedModule { }
