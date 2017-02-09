/* tslint:disable: no-switch-case-fall-through */
import { Action } from '@ngrx/store';

import { OverlayActions } from './overlay.actions';
import { OverlayConfig } from '../../shared/overlay/overlay-config.model';

export interface OverlayState {
  src: any;
  config: OverlayConfig;
}

const initialState: OverlayState = {
  src: null,
  config: null,
};

export function overlayReducer(state = initialState, action: Action): OverlayState {
  switch (action.type) {

    /**
     * payload: { content: any, config: OverlayConfig }
     */
    case OverlayActions.OPEN_OVERLAY: {
      return Object.assign({}, state, {
        src: action.payload.content,
        config: action.payload.config
      });
    }

    /**
     * payload: undefined
     */
    case OverlayActions.CLOSE_OVERLAY: {
      return Object.assign({}, state, {
        src: null,
        config: null
      });
    }

    default: {
      return state;
    }
  }
}
