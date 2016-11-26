/* tslint:disable: member-ordering */
import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';

import { ServerError } from '../../../services/server-error.model';

import { PostResponse } from './post-response.model';
import { PostFilters } from './post-filters.model';

@Injectable()
export class PostActions {

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

  // TODO: call this action as a side effect of category-data when checking a category
  static RESET_COMPLETION = '[Post] Reset Completion';
  resetCompletion(): Action {
    return {
      type: PostActions.RESET_COMPLETION
    };
  }
}
