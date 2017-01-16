/* tslint:disable: member-ordering */
import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';

import { ServerError } from '../../../services/server-error.model';

import { LitePostResponse } from './lite-post-response.model';
import { LitePostFilters } from './lite-post-filters.model';
import { LitePost } from './lite-post.model';

export const LITE_PREFIX: string = 'Lite Post';

@Injectable()
export class LitePostActions {

  static LOAD_POSTS = `[${LITE_PREFIX}] Load Posts`;
  loadPosts(): Action {
    return {
      type: LitePostActions.LOAD_POSTS
    };
  }

  static LOAD_POSTS_FROM_CACHE = `[${LITE_PREFIX}] Load Posts From Cache`;
  loadPostsFromCache(): Action {
    return {
      type: LitePostActions.LOAD_POSTS_FROM_CACHE
    };
  }

  static LOAD_POSTS_SUCCESS = `[${LITE_PREFIX}] Load Posts Success`;
  loadPostsSuccess(): Action {
    return {
      type: LitePostActions.LOAD_POSTS_SUCCESS
    };
  }

  static LOAD_POSTS_FAIL = `[${LITE_PREFIX}] Load Posts Fail`;
  loadPostsFail(): Action {
    return {
      type: LitePostActions.LOAD_POSTS_FAIL
    };
  }

  static REQ_POSTS = `[${LITE_PREFIX}] Request Posts`;
  reqPosts(filters: LitePostFilters = {}): Action {
    return {
      type: LitePostActions.REQ_POSTS,
      payload: filters
    };
  }

  static REQ_POSTS_FAIL = `[${LITE_PREFIX}] Request Posts Fail`;
  reqPostsFail(err: ServerError): Action {
    return {
      type: LitePostActions.REQ_POSTS_FAIL,
      payload: err
    };
  }

  static REQ_POSTS_SUCCESS = `[${LITE_PREFIX}] Request Posts Success`;
  reqPostsSuccess(response: LitePostResponse): Action {
    return {
      type: LitePostActions.REQ_POSTS_SUCCESS,
      payload: response
    };
  }

  static CACHE_POSTS = `[${LITE_PREFIX}] Cache Posts`;
  cachePosts(posts: LitePost[]): Action {
    return {
      type: LitePostActions.CACHE_POSTS,
      payload: posts
    };
  }

  static FILTERS_TOGGLE_CATEGORY = `[${LITE_PREFIX}] Filters Toggle Category`;
  filtersToggleCategory(id: number): Action {
    return {
      type: LitePostActions.FILTERS_TOGGLE_CATEGORY,
      payload: id
    };
  }
}
