import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';

import { PostEffects } from './post.effects';
import { PostActions } from './post.actions';
import { PostService } from './post.service';
import { FakePostService } from './fake-post.service';

@NgModule({
  imports: [ EffectsModule.run(PostEffects) ],
  providers: [
    PostActions,
    PostService
    // { provide: PostService, useClass: FakePostService }
  ]
})
export class PostDataModule { }
