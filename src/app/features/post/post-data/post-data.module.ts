import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';

import { PostEffects } from './post.effects';
import { PostService } from './post.service';
import { PostActions } from './post.actions';

@NgModule({
  imports: [ EffectsModule.run(PostEffects) ],
  providers: [
    PostService,
    PostActions
  ]
})
export class PostDataModule { }
