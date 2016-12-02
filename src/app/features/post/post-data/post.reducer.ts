/* tslint:disable: no-switch-case-fall-through */
import { Action } from '@ngrx/store';

import { ServerError } from '../../../services/server-error.model';

import { PostActions } from './post.actions';
import { Post } from './post.model';
import { PostFilters } from './post-filters.model';
import { PAGE_SIZE } from './post.constant';

export interface PostState {
  cache: Post[];
  posts: Post[];
  loading: boolean;
  requesting: boolean;
  error: ServerError;
  complete: boolean;
  filters: PostFilters;
}

const initialState: PostState = {
  cache: [],
  posts: [],
  loading: false,
  requesting: false,
  error: null,
  complete: false,
  filters: { remaining: 0, categories: [], slug: null },
};

export function postReducer(state = initialState, action: Action): PostState {
  switch (action.type) {

    /**
     * payload: string
     */
    case PostActions.LOAD_POST_BY_SLUG: {
      return Object.assign({}, state, {
        loading: true,
        remaining: 1,
        filters: Object.assign({}, state.filters, {
          slug: action.payload
        })
      });
    }

    /**
     * payload: undefined
     */
    case PostActions.LOAD_POST_BY_SLUG_FAIL:
    case PostActions.LOAD_POST_BY_SLUG_SUCCESS: {
      return Object.assign({}, state, {
        loading: false,
        remaining: 0,
        filters: Object.assign({}, state.filters, {
          slug: null
        })
      });
    }

    /**
     * payload: undefined
     */
    case PostActions.LOAD_POSTS: {
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
    case PostActions.LOAD_POSTS_SUCCESS:
    case PostActions.LOAD_POSTS_FAIL: {
      return Object.assign({}, state, {
        loading: false
      });
    }

    /**
     * payload: undefined
     */
    case PostActions.LOAD_POSTS_FROM_CACHE: {
      let remaining: number = state.filters.remaining;
      let lastDate: string = state.filters.before;
      let newPosts: Post[] = [];

      if (state.cache.length) {
        //slug
        if (state.filters.slug) {
          const slugPost: Post = state.cache.find((post: Post) => post.slug.includes(state.filters.slug));
          if(slugPost) {
            newPosts.push(slugPost);
            remaining = 0;
          }
        }
        // date
        if (remaining && state.filters.before) {
          // todo: dichotomy
          const beforeDate: Date = new Date(state.filters.before);
          newPosts = state.cache.filter((post: Post) => new Date(post.date) < beforeDate);
          // if we don't need to filter newPost again, we make sure to have 12 max new posts.
          if(!state.filters.categories.length) {
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
          let filteredPosts: Post[] = [];
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
        if (newPosts.length) {
          lastDate = new Date(newPosts[newPosts.length - 1].date).toISOString();
        }
      }
      return Object.assign({}, state, {
        filters: Object.assign({}, state.filters, {
          remaining: remaining,
          before: lastDate
        }),
        posts: [ ... state.posts, ...newPosts ]
      });
    }

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
        complete: action.payload.complete,
        filters: Object.assign({}, state.filters, { remaining: 0 })
      });
    }

    /**
     * payload: Post[]
     */
    case PostActions.CACHE_POSTS: {
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
    case PostActions.FILTERS_TOGGLE_CATEGORY: {
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
