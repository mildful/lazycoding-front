import { NgModule } from '@angular/core';

import { TagDataModule } from '../../core/tag-data/tag-data.module';

// I should create some tag components

@NgModule({
  exports: [ TagDataModule ]
})
export class TagModule { }
