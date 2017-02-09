import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';

import { PostService } from '../post.service';
import { FakePostService } from '../fake-post.service';

import { FullPostEffects } from './full-post.effects';
import { FullPostActions } from './full-post.actions';

@NgModule({
  imports: [ EffectsModule.run(FullPostEffects) ],
  providers: [
    FullPostActions,
    PostService
    // { provide: PostService, useClass: FakePostService }
  ]
})
export class FullPostDataModule { }
