/* tslint:disable: no-switch-case-fall-through */
import { Action } from '@ngrx/store';

import { ServerError } from '../../services/server-error.model';

import { TagActions } from './tag.actions';
import { Tag } from './tag.model';

export interface TagState {
  tags: Tag[];
  requesting: boolean;
  error: ServerError;
}

const initialState: TagState = {
  tags: [],
  requesting: false,
  error: null,
};

export function tagReducer(state = initialState, action: Action): TagState {
  switch (action.type) {

    /**
     * payload: undefined
     */
    case TagActions.REQ_ALL_TAGS: {
      return Object.assign({}, state, {
        requesting: true
      });
    }

    /**
     * payload: ServerError
     */
    case TagActions.REQ_TAGS_FAIL: {
      return Object.assign({}, state, {
        requesting: false,
        error: action.payload
      });
    }

    /**
     * payload: Tag[]
     */
    case TagActions.REQ_TAGS_SUCCESS: {
      return Object.assign({}, state, {
        requesting: false,
        tags: action.payload,
        error: null
      });
    }

    default: {
      return state;
    }
  }
}
