/* tslint:disable: no-switch-case-fall-through */
import { Action } from '@ngrx/store';

import { ServerError } from '../../../../services/server-error.model';

import { FullPostActions } from './full-post.actions';
import { FullPost } from './full-post.model';

export interface FullPostState {
  cache: FullPost[];
  currentPost: FullPost;
  loading: boolean;
  requesting: boolean;
  error: ServerError;
  slug: string;
}

export const initialState: FullPostState = {
  cache: [],
  currentPost: null,
  loading: false,
  requesting: false,
  error: null,
  slug: null,
};

export function fullPostReducer(state = initialState, action: Action): FullPostState {
  switch (action.type) {

    /**
     * payload: string
     */
    case FullPostActions.LOAD_POST_BY_SLUG: {
      return Object.assign({}, state, {
        loading: true,
        slug: action.payload
      });
    }

    /**
     * payload: undefined
     */
    case FullPostActions.LOAD_POST_BY_SLUG_FAIL:
    case FullPostActions.LOAD_POST_BY_SLUG_SUCCESS: {
      return Object.assign({}, state, {
        loading: false
      });
    }

    /**
     * payload: undefined
     */
    case FullPostActions.LOAD_POST_FROM_CACHE: {
      let post: FullPost = null;
      if (state.cache.length) {
        post = state.cache.find((post: FullPost) => post.slug.includes(state.slug));
      }
      return Object.assign({}, state, {
        currentPost: post,
        slug: post ? null : state.slug
      });
    }

    /**
     * payload: string
     */
    case FullPostActions.REQ_POST_BY_SLUG: {
      return Object.assign({}, state, {
        requesting: true
      });
    }

    /**
     * payload: ServerError
     */
    case FullPostActions.REQ_POST_BY_SLUG_FAIL: {
      return Object.assign({}, state, {
        requesting: false,
        error: action.payload
      });
    }

    /**
     * payload: FullPost
     */
    case FullPostActions.REQ_POST_BY_SLUG_SUCCESS: {
      return Object.assign({}, state, {
        requesting: false,
        error: null,
        currentPost: action.payload
      });
    }

    /**
     * payload: FullPost
     */
    case FullPostActions.CACHE_POST: {
      return Object.assign({}, state, {
        cache: [ ...state.cache, action.payload ]
      });
    }

    default: {
      return state;
    }
  }
}
