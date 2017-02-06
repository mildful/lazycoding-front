/* tslint:disable: member-ordering */
import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';

import { ServerError } from '../../../services/server-error.model';

import { LitePostFilters } from './lite-post-filters.model';
import { LitePost } from './lite-post.model';

export const LITE_PREFIX: string = 'Lite Post';

@Injectable()
export class LitePostActions {

  static REQ_POSTS = `[${LITE_PREFIX}] Request Posts`;
  reqPosts(): Action {
    return {
      type: LitePostActions.REQ_POSTS
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
  reqPostsSuccess(posts: LitePost[]): Action {
    return {
      type: LitePostActions.REQ_POSTS_SUCCESS,
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
