/* tslint:disable: member-ordering */
import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';

import { ServerError } from '../../../../services/server-error.model';

import { FullPost } from './full-post.model';

export const FULL_PREFIX: string = 'Full Post';

@Injectable()
export class FullPostActions {

  static LOAD_POST_BY_SLUG = `[${FULL_PREFIX}] Load Post By Slug`;
  loadPostBySlug(slug: string): Action {
    return {
      type: FullPostActions.LOAD_POST_BY_SLUG,
      payload: slug
    };
  }

  static LOAD_POST_BY_SLUG_FAIL = `[${FULL_PREFIX}] Load Post By Slug Fail`;
  loadPostBySlugFail(): Action {
    return {
      type: FullPostActions.LOAD_POST_BY_SLUG_FAIL
    };
  }

  static LOAD_POST_BY_SLUG_SUCCESS = `[${FULL_PREFIX}] Load Post By Slug Success`;
  loadPostBySlugSuccess(): Action {
    return {
      type: FullPostActions.LOAD_POST_BY_SLUG_SUCCESS
    };
  }

  static LOAD_POST_FROM_CACHE = `[${FULL_PREFIX}] Load Post From Cache`;
  loadPostFromCache(): Action {
    return {
      type: FullPostActions.LOAD_POST_FROM_CACHE
    };
  }

  static REQ_POST_BY_SLUG = `[${FULL_PREFIX}] Request Post By Slug`;
  reqPostBySlug(slug: string): Action {
    return {
      type: FullPostActions.REQ_POST_BY_SLUG,
      payload: slug
    };
  }

  static REQ_POST_BY_SLUG_FAIL = `[${FULL_PREFIX}] Request Post By Slug Fail`;
  reqPostBySlugFail(err: ServerError): Action {
    return {
      type: FullPostActions.REQ_POST_BY_SLUG_FAIL,
      payload: err
    };
  }

  static REQ_POST_BY_SLUG_SUCCESS = `[${FULL_PREFIX}] Request Post By Slug Success`;
  reqPostBySlugSuccess(post: FullPost): Action {
    return {
      type: FullPostActions.REQ_POST_BY_SLUG_SUCCESS,
      payload: post
    };
  }

  static CACHE_POST = `[${FULL_PREFIX}] Cache Post`;
  cachePost(post: FullPost): Action {
    return {
      type: FullPostActions.CACHE_POST,
      payload: post
    };
  }
}
