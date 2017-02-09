import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';

import { FakeCategoryService } from './fake-category.service';
import { CategoryService } from './category.service';
import { CategoryEffects } from './category.effects';
import { CategoryActions } from './category.actions';

@NgModule({
  imports: [ EffectsModule.run(CategoryEffects) ],
  providers: [
    // CategoryService,
    { provide: CategoryService, useClass: FakeCategoryService },
    CategoryActions
  ]
})
export class CategoryDataModule { }
