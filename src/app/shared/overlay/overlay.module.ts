import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OverlayComponent } from './overlay.component';
import { OverlayActions } from '../../core/overlay-data/overlay.actions';

@NgModule({
  imports: [ CommonModule ],
  declarations: [ OverlayComponent ],
  exports: [ OverlayComponent ],
  providers: [ OverlayActions ]
})
export class OverlayModule { }
