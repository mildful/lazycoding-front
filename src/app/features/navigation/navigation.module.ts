import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../shared';
import { NavigationDataModule } from '../../core';

import { NavigationComponent } from './navigation.component';

@NgModule({
  imports: [
    RouterModule,
    SharedModule,
    NavigationDataModule
  ],
  declarations: [ NavigationComponent ],
  exports: [ NavigationComponent ]
})
export class NavigationModule { }
