import { NgModule } from '@angular/core';

import { LitePostDataModule } from './lite-post';
import { FullPostDataModule } from './full-post';

@NgModule({
  exports: [
    LitePostDataModule,
    FullPostDataModule
  ]
})
export class PostDataModule { }
