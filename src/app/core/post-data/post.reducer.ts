/* tslint:disable: no-switch-case-fall-through */
import { Action } from '@ngrx/store';

import { ServerError } from '../../services/server-error.model';

import { PostActions } from './post.actions';
import { Post } from './post.model';
import { PAGE_SIZE } from './post.constants';
import { PostFilters } from './post-filters.model';
import { toggleArrayValues } from "../../services/utils";

export interface PostState {
  posts: Post[];
  readingPost: Post;
  requesting: boolean;
  error: ServerError;
  filters: PostFilters;
  missingSlug: string;
  complete: boolean;
}

export const initialState: PostState = {
  posts: [],
  readingPost: null,
  requesting: false,
  error: null,
  filters: { categories: [], page: 1 },
  missingSlug: null,
  complete: false,
};

export function postReducer(state = initialState, action: Action): PostState {
  switch (action.type) {

    /**
     * payload: PostFilters
     */
    case PostActions.REQ_POSTS:
    case PostActions.REQ_POST_BY_SLUG: {
      return Object.assign({}, state, {
        requesting: true
      });
    }

    /**
     * payload: ServerError
     */
    case PostActions.REQ_POSTS_FAIL:
    case PostActions.REQ_POST_BY_SLUG_FAIL: {
      return Object.assign({}, state, {
        requesting: false,
        error: action.payload
      });
    }

    /**
     * payload: LitePost[]
     */
    case PostActions.REQ_POSTS_SUCCESS: {
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
     * payload: number[]
     */
    case PostActions.FILTERS_TOGGLE_CATEGORY: {
      //let categories: number[] = [ ...state.filters.categories ];
      let categories: number[] = toggleArrayValues(state.filters.categories, action.payload);
      /*action.payload.forEach((toggledId: number) => {
        if (categories.includes(toggledId)) {
          categories.splice( categories.indexOf(toggledId), 1 );
        } else {
          categories.push(toggledId);
        }
      });*/
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

    /**
     * payload: string
     */
    case PostActions.SET_READING_POST: {
      const readingPost: Post = state.posts.find((p: Post) => p.slug === action.payload);
      return Object.assign({}, state, {
        readingPost: readingPost ? readingPost : null,
        missingSlug: readingPost ? null : action.payload
      });
    }

    /**
     * payload: Post
     */
    case PostActions.REQ_POST_BY_SLUG_SUCCESS: {
      return Object.assign({}, state, {
        readingPost: action.payload,
        missingSlug: null
      });
    }

    /**
     * payload: undefined
     */
    case PostActions.RESET_CATEGORY_FILTER: {
      return Object.assign({}, state, {
        // We reset complete because since we have change our filters, there may be more posts to request
        // on the server.
        complete: false,
        filters: Object.assign({}, state.filters, {
          categories: [],
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
