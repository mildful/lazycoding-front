/* tslint:disable: no-switch-case-fall-through */
import { Action } from '@ngrx/store';

import { ServerError } from '../../../services/server-error.model';

import { LitePostActions } from './lite-post.actions';
import { LitePost } from './lite-post.model';
import { PAGE_SIZE } from './lite-post.constant';
import { LitePostFilters } from './lite-post-filters.model';

export interface LitePostState {
  posts: LitePost[];
  requesting: boolean;
  error: ServerError;
  filters: LitePostFilters;
  complete: boolean;
}

export const initialState: LitePostState = {
  posts: [],
  requesting: false,
  error: null,
  filters: { categories: [], page: 1 },
  complete: false,
};

export function litePostReducer(state = initialState, action: Action): LitePostState {
  switch (action.type) {

    /**
     * payload: PostFilters
     */
    case LitePostActions.REQ_POSTS: {
      return Object.assign({}, state, {
        requesting: true
      });
    }

    /**
     * payload: ServerError
     */
    case LitePostActions.REQ_POSTS_FAIL: {
      return Object.assign({}, state, {
        requesting: false,
        error: action.payload
      });
    }

    /**
     * payload: LitePost[]
     */
    case LitePostActions.REQ_POSTS_SUCCESS: {
      const complete: boolean = action.payload.length < PAGE_SIZE;
      return Object.assign({}, state, {
        posts: [ ...state.posts, ...action.payload ],
        requesting: false,
        error: null,
        filters: Object.assign({}, state.filters, {
          page: state.filters.page + 1
        }),
        complete
      });
    }

    /**
     * payload: number
     */
    case LitePostActions.FILTERS_TOGGLE_CATEGORY: {
      let categories: number[] = [ ...state.filters.categories ];
      if (categories.includes(action.payload)) {
        categories.splice( categories.indexOf(action.payload), 1 );
      } else {
        categories.push(action.payload);
      }
      return Object.assign({}, state, {
        // We reset complete because since we have change our filters, there may be more posts to request
        // on the server.
        complete: false,
        filters: Object.assign({}, state.filters, {
          categories,
          page: 1
        }),
        posts: []
      });
    }

    default: {
      return state;
    }
  }
}
