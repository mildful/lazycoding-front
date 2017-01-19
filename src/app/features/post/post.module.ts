import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { DisqusModule } from '../disqus';
import { PostDataModule } from '../../core';

import { WindowRef } from './window-ref';
import { routedComponents, PostRoutingModule } from './post.routing';
import { PostCardComponent } from './post-card';

@NgModule({
  imports: [
    SharedModule,
    PostRoutingModule,
    PostDataModule,
    DisqusModule
  ],
  declarations: [
    ...routedComponents,
    PostCardComponent
  ],
  providers: [ WindowRef ]
})
export class PostModule { }
