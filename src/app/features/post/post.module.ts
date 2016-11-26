import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';

import { WindowRef } from './window-ref';
import { routedComponents, PostRoutingModule } from './post.routing';
import { PostCardComponent } from './post-card';
import { PostDataModule } from './post-data';

@NgModule({
  imports: [
    SharedModule,
    PostRoutingModule,
    PostDataModule
  ],
  declarations: [
    ...routedComponents,
    PostCardComponent
  ],
  providers: [ WindowRef ]
})
export class PostModule { }
