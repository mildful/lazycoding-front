import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';

import { CategoryEffects } from './category.effects';
import { CategoryService } from './category.service';
import { CategoryActions } from './category.actions';

@NgModule({
  imports: [ EffectsModule.run(CategoryEffects) ],
  providers: [
    CategoryService,
    CategoryActions
  ]
})
export class CategoryDataModule { }
