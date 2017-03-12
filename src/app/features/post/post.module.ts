import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { DisqusModule } from '../disqus';
import { WindowRef } from '../../shared/window-ref';
import { CategoryModule } from "../category/category.module";

import { routedComponents, PostRoutingModule } from './post.routing';
import { PostCardComponent } from './post-card';
import { PostListLoaderComponent } from "./post-list";

@NgModule({
  imports: [
    SharedModule,
    PostRoutingModule,
    DisqusModule,
    CategoryModule,
  ],
  declarations: [
    ...routedComponents,
    PostCardComponent,
    PostListLoaderComponent
  ],
  providers: [ WindowRef ]
})
export class PostModule { }
