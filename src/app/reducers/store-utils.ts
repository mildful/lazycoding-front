import { Store } from '@ngrx/store';

import { AppState } from './index';

export function getState(store: Store<AppState>): AppState {
  let state: AppState;
  store.take(1).subscribe(s => state = s);
  return state;
}