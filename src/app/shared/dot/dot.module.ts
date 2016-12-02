import { NgModule } from '@angular/core';

import { DotComponent } from './dot.component';
import { DotContentComponent } from './dot-content.component';

@NgModule({
  declarations: [
    DotComponent,
    DotContentComponent
  ],
  exports: [
    DotComponent,
    DotContentComponent
  ],
})
export class DotModule { }
