/* tslint:disable: no-switch-case-fall-through */
import { Action } from '@ngrx/store';

import { NavigationActions } from './navigation.actions';

export interface NavigationState {
  isOpen: boolean;
}

const initialState: NavigationState = {
  isOpen: true
};

export function navigationReducer(state = initialState, action: Action): NavigationState {
  switch (action.type) {

    /**
     * payload: undefined
     */
    case NavigationActions.TOGGLE_NAVIGATION: {
      return Object.assign({}, state, {
        isOpen: !state.isOpen
      });
    }

    default: {
      return state;
    }
  }
}
