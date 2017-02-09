/* tslint:disable: no-switch-case-fall-through */
import { Action } from '@ngrx/store';

import {
  LitePostState,
  liteInitialState,
  LITE_PREFIX,
  litePostReducer
} from './lite-post';
import {
  FullPostState,
  fullInitialState,
  FULL_PREFIX,
  fullPostReducer
} from './full-post';

export interface PostState {
  lite: LitePostState;
  full: FullPostState;
}

const initialState: PostState = {
  lite: liteInitialState,
  full: fullInitialState,
};

export function postReducer(state = initialState, action: Action): PostState {

  if (action.type.indexOf(`[${LITE_PREFIX}]`) === 0) {
    return Object.assign({}, state, {
      lite: litePostReducer(state.lite, action)
    });
  }

  if (action.type.indexOf(`[${FULL_PREFIX}]`) === 0) {
    return Object.assign({}, state, {
      full: fullPostReducer(state.full, action)
    });
  }

  return state;
}
