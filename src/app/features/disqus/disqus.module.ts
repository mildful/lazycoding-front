import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';

import { DisqusComponent } from './disqus.component';

@NgModule({
  imports: [ SharedModule ],
  declarations: [ DisqusComponent ],
  exports: [ DisqusComponent ]
})
export class DisqusModule { }
