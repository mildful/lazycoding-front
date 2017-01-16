import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { DisqusModule } from '../disqus';
// import { CategoryModule } from '../category/category.module';
import { PostDataModule } from '../../core';

import { WindowRef } from './window-ref';
import { routedComponents, PostRoutingModule } from './post.routing';
import { PostCardComponent } from './post-card';

@NgModule({
  imports: [
    SharedModule,
    PostRoutingModule,
    PostDataModule,
    // CategoryModule,
    DisqusModule
  ],
  declarations: [
    ...routedComponents,
    PostCardComponent
  ],
  providers: [ WindowRef ]
})
export class PostModule { }
