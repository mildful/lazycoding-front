import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OverlayComponent } from './overlay.component';
import { OverlayActions } from './overlay.actions';

@NgModule({
  imports: [ CommonModule ],
  declarations: [ OverlayComponent ],
  exports: [ OverlayComponent ],
  providers: [ OverlayActions ]
})
export class OverlayModule { }
