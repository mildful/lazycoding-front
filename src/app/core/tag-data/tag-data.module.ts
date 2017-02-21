import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';

import { TagEffects } from './tag.effects';
import { TagService } from './tag.service';
import { TagActions } from './tag.actions';
import { FakeTagService } from './fake-tag.service';

@NgModule({
  imports: [ EffectsModule.run(TagEffects) ],
  providers: [
    TagService,
    // { provide: TagService, useClass: FakeTagService },
    TagActions
  ]
})
export class TagDataModule { }
