import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../shared';
import { NavigationDataModule } from '../../core';
import { CategoryModule } from '../category/category.module';

import { NavigationComponent } from './navigation.component';

@NgModule({
  imports: [
    RouterModule,
    SharedModule,
    CategoryModule,
    NavigationDataModule
  ],
  declarations: [ NavigationComponent ],
  exports: [ NavigationComponent ]
})
export class NavigationModule { }
