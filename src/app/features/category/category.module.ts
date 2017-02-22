import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';

import { CategoryListComponent } from './category-list/category-list.component';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [ CategoryListComponent ],
  exports: [
    CategoryListComponent
  ]
})
export class CategoryModule { }
