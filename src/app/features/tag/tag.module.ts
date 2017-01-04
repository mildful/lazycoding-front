import { NgModule } from '@angular/core';

import { TagDataModule } from './tag-data/tag-data.module';

// I should create some tag components

@NgModule({
  exports: [ TagDataModule ]
})
export class TagModule { }
