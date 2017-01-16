import { NgModule, Optional, SkipSelf } from '@angular/core';

import { NavigationActions } from './navigation-data';

@NgModule({
  providers: [
    NavigationActions
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
