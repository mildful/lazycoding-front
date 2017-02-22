import { NgModule, Optional, SkipSelf } from '@angular/core';

import { NavigationDataModule } from './navigation-data';
import { PostDataModule } from './post-data';
import { CategoryDataModule } from './category-data';

@NgModule({
  exports: [
    NavigationDataModule,
    PostDataModule,
    CategoryDataModule,
  ],
})
export class CoreModule {

  constructor (@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only');
    }
  }
}
