import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';

import { TagEffects } from './tag.effects';
import { TagService } from './tag.service';
import { TagActions } from './tag.actions';

@NgModule({
  imports: [ EffectsModule.run(TagEffects) ],
  providers: [
    TagService,
    TagActions
  ]
})
export class TagDataModule { }
