/* tslint:disable: no-switch-case-fall-through */
import { Action } from '@ngrx/store';

import { ServerError } from '../../../../services/server-error.model';

import { LitePostActions } from './lite-post.actions';
import { LitePost } from './lite-post.model';
import { LitePostFilters } from './lite-post-filters.model';
import { PAGE_SIZE } from './lite-post.constant';

export interface LitePostState {
  cache: LitePost[];
  posts: LitePost[];
  loading: boolean;
  requesting: boolean;
  error: ServerError;
  complete: boolean;
  filters: LitePostFilters;
}

export const initialState: LitePostState = {
  cache: [],
  posts: [],
  loading: false,
  requesting: false,
  error: null,
  complete: false,
  filters: { remaining: 0, categories: [] },
};

export function litePostReducer(state = initialState, action: Action): LitePostState {
  switch (action.type) {

    /**
     * payload: undefined
     */
    case LitePostActions.LOAD_POSTS: {
      const lastDate: string = state.posts.length
        ? state.posts[state.posts.length - 1].date
        : new Date().toISOString();
      return Object.assign({}, state, {
        loading: true,
        filters: Object.assign({}, state.filters, {
          before: lastDate,
          remaining: PAGE_SIZE
        })
      });
    }

    /**
     * payload: undefined
     */
    case LitePostActions.LOAD_POSTS_SUCCESS:
    case LitePostActions.LOAD_POSTS_FAIL: {
      return Object.assign({}, state, {
        loading: false
      });
    }

    /**
     * payload: undefined
     */
    case LitePostActions.LOAD_POSTS_FROM_CACHE: {
      let remaining: number = state.filters.remaining;
      let lastDate: string = state.filters.before;
      let newPosts: LitePost[] = [];

      if (state.cache.length) {
        // date
        if (remaining && state.filters.before) {
          // todo: dichotomy
          const beforeDate: Date = new Date(state.filters.before);
          newPosts = state.cache.filter((post: LitePost) => new Date(post.date) < beforeDate);
          // if we don't need to filter newPost again, we make sure to have 12 max new posts.
          if (!state.filters.categories.length) {
            // take only 12 (remaining) firsts posts
            if (newPosts.length >= remaining) {
              newPosts = newPosts.slice(0, remaining);
              remaining = 0;
            } else {
              remaining -= newPosts.length;
            }
          }
        }
        // categories
        if (remaining && state.filters.categories && state.filters.categories.length) {
          let filteredPosts: LitePost[] = [];
          for (let post of newPosts) {
            if (remaining === 0) break;
            const valid: boolean = post.categories.some((cid: number) => state.filters.categories.includes(cid));
            if (valid) {
              remaining--;
              filteredPosts.push(post);
            }
          }
          newPosts = filteredPosts;
        }

        // if some posts have been loaded from cache, update the date of the last post in filters
        // but only if a date is already set. If lastDate is null, the we don't care about this filter.
        if (newPosts.length) {
          lastDate = new Date(newPosts[newPosts.length - 1].date).toISOString();
        }
      }
      return Object.assign({}, state, {
        filters: Object.assign({}, state.filters, {
          remaining: remaining,
          before: lastDate
        }),
        posts: [ ...state.posts, ...newPosts ]
      });
    }

    /**
     * payload: PostFilters
     */
    case LitePostActions.REQ_POSTS: {
      return Object.assign({}, state, {
        requesting: true,
        error: null
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
     * payload: { posts: Post[], complete: boolean }: PostResponse
     */
    case LitePostActions.REQ_POSTS_SUCCESS: {
      return Object.assign({}, state, {
        posts: [ ...state.posts, ...action.payload.posts ],
        requesting: false,
        error: null,
        complete: action.payload.complete,
        filters: Object.assign({}, state.filters, { remaining: 0 })
      });
    }

    /**
     * payload: Post[]
     */
    case LitePostActions.CACHE_POSTS: {
      return Object.assign({}, state, {
        cache: [
          ...state.cache,
          ...action.payload
        ]
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
        filters: Object.assign({}, state.filters, { categories }),
        posts: []
      });
    }

    default: {
      return state;
    }
  }
}
