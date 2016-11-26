/* tslint:disable: no-switch-case-fall-through */
import { Action } from '@ngrx/store';

import { ServerError } from '../../../services/server-error.model';

import { PostActions } from './post.actions';
import { Post } from './post.model';

export interface PostState {
  posts: Post[];
  requesting: boolean;
  error: ServerError;
  complete: boolean;
}

const initialState: PostState = {
  posts: [],
  requesting: false,
  error: null,
  complete: false,
};

export function postReducer(state = initialState, action: Action): PostState {
  switch (action.type) {

    /**
     * payload: PostFilters
     */
    case PostActions.REQ_POSTS: {
      return Object.assign({}, state, {
        requesting: true,
        error: null
      });
    }

    /**
     * payload: ServerError
     */
    case PostActions.REQ_POSTS_FAIL: {
      return Object.assign({}, state, {
        requesting: false,
        error: action.payload
      });
    }

    /**
     * payload: { posts: Post[], complete: boolean }: PostResponse
     */
    case PostActions.REQ_POSTS_SUCCESS: {
      return Object.assign({}, state, {
        posts: [ ...state.posts, ...action.payload.posts ],
        requesting: false,
        error: null,
        complete: action.payload.complete
      });
    }

    /**
     * payload: undefined
     */
    case PostActions.RESET_COMPLETION: {
      return Object.assign({}, state, {
        complete: false
      });
    }

    default: {
      return state;
    }
  }
}
