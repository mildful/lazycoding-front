import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, PreloadAllModules } from '@angular/router';

import { RouterStoreModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { useLogMonitor } from '@ngrx/store-log-monitor';

import { routes } from './app.routing';
import { rootReducer } from './reducers';
import { StoreDevToolsModule } from './features/store-devtools/store-devtools.module';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';

const STORE_DEV_TOOLS_IMPORTS = [];
//if (ENV === 'development' && !AOT &&
if (ENV === 'development' && !AOT) {
  // set in constants.js file in project root
  if (['monitor', 'both'].includes(STORE_DEV_TOOLS)) {
    STORE_DEV_TOOLS_IMPORTS.push(...[
      StoreDevtoolsModule.instrumentStore({
        monitor: useLogMonitor({
          visible: true,
          position: 'right'
        })
      })
    ]);
  } else if (['extension'].includes(STORE_DEV_TOOLS)) {
    STORE_DEV_TOOLS_IMPORTS.push(...[
      StoreDevtoolsModule.instrumentOnlyWithExtension()
    ]);
  }
}

export const APP_IMPORTS = [
  ReactiveFormsModule,
  RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  RouterStoreModule.connectRouter(),
  StoreModule.provideStore(rootReducer),
  STORE_DEV_TOOLS_IMPORTS,
  StoreDevToolsModule,
  CoreModule,
  SharedModule,
];

