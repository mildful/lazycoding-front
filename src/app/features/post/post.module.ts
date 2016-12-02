import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { CategoryModule } from '../category/category.module';

import { WindowRef } from './window-ref';
import { routedComponents, PostRoutingModule } from './post.routing';
import { PostCardComponent } from './post-card';
import { PostDataModule } from './post-data';

@NgModule({
  imports: [
    SharedModule,
    PostRoutingModule,
    PostDataModule,
    CategoryModule
  ],
  declarations: [
    ...routedComponents,
    PostCardComponent
  ],
  providers: [ WindowRef ]
})
export class PostModule { }
