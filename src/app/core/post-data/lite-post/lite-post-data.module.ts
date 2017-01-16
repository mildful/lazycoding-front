import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';

import { PostService } from '../post.service';
import { FakePostService } from '../fake-post.service';

import { LitePostEffects } from './lite-post.effects';
import { LitePostActions } from './lite-post.actions';

@NgModule({
  imports: [ EffectsModule.run(LitePostEffects) ],
  providers: [
    LitePostActions,
    // PostService
    { provide: PostService, useClass: FakePostService }
  ]
})
export class LitePostDataModule { }
