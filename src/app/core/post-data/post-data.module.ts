import { NgModule } from '@angular/core';

import { LitePostDataModule } from './lite-post';
import { FullPostDataModule } from './full-post';

@NgModule({
  imports: [
    LitePostDataModule,
    FullPostDataModule
  ],
  exports: [
    LitePostDataModule,
    FullPostDataModule
  ]
})
export class PostDataModule { }
