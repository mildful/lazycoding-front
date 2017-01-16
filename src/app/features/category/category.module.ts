import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { LitePostDataModule } from '../../core';

import { CategoryDataModule } from './category-data';
import { CategoryListComponent } from './category-list/category-list.component';

@NgModule({
  imports: [
    SharedModule,
    LitePostDataModule
  ],
  declarations: [ CategoryListComponent ],
  exports: [
    CategoryDataModule,
    CategoryListComponent
  ]
})
export class CategoryModule { }
