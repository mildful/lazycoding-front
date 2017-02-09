import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { CategoryDataModule } from '../../core';

import { CategoryListComponent } from './category-list/category-list.component';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [ CategoryListComponent ],
  exports: [
    CategoryDataModule,
    CategoryListComponent
  ]
})
export class CategoryModule { }
