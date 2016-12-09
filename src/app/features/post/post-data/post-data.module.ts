import { NgModule } from '@angular/core';

import { PostService } from './post.service';
import { FakePostService } from './fake-post.service';
import { LitePostDataModule } from './lite-post';
import { FullPostDataModule } from './full-post';

@NgModule({
  imports: [
    LitePostDataModule,
    FullPostDataModule
  ]
})
export class PostDataModule { }
