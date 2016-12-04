/* tslint:disable: member-ordering */
import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';

import { ServerError } from '../../../services/server-error.model';

import { PostResponse } from './post-response.model';
import { PostFilters } from './post-filters.model';
import { Post } from './post.model';

@Injectable()
export class PostActions {

  static LOAD_POSTS = '[Post] Load Posts';
  loadPosts(): Action {
    return {
      type: PostActions.LOAD_POSTS
    };
  }

  static LOAD_POSTS_FROM_CACHE = '[Post] Load Posts From Cache';
  loadPostsFromCache(): Action {
    return {
      type: PostActions.LOAD_POSTS_FROM_CACHE
    };
  }

  static LOAD_POSTS_SUCCESS = '[Post] Load Posts Success';
  loadPostsSuccess(): Action {
    return {
      type: PostActions.LOAD_POSTS_SUCCESS
    };
  }

  static LOAD_POSTS_FAIL = '[Post] Load Posts Fail';
  loadPostsFail(): Action {
    return {
      type: PostActions.LOAD_POSTS_FAIL
    };
  }

  static REQ_POSTS = '[Post] Request Posts';
  reqPosts(filters: PostFilters = {}): Action {
    return {
      type: PostActions.REQ_POSTS,
      payload: filters
    };
  }

  static REQ_POSTS_FAIL = '[Post] Request Posts Fail';
  reqPostsFail(err: ServerError): Action {
    return {
      type: PostActions.REQ_POSTS_FAIL,
      payload: err
    };
  }

  static REQ_POSTS_SUCCESS = '[Post] Request Posts Success';
  reqPostsSuccess(response: PostResponse): Action {
    return {
      type: PostActions.REQ_POSTS_SUCCESS,
      payload: response
    };
  }

  static CACHE_POSTS = '[Post] Cache Posts';
  cachePosts(posts: Post[]): Action {
    return {
      type: PostActions.CACHE_POSTS,
      payload: posts
    };
  }

  static FILTERS_TOGGLE_CATEGORY = '[Post] Filters Toggle Category';
  filtersToggleCategory(id: number): Action {
    return {
      type: PostActions.FILTERS_TOGGLE_CATEGORY,
      payload: id
    };
  }
}
