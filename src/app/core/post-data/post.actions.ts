/* tslint:disable: member-ordering */
import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';

import { ServerError } from '../../services/server-error.model';

import { Post } from './post.model';

@Injectable()
export class PostActions {

  static REQ_POSTS = `[Post] Request Posts`;
  reqPosts(): Action {
    return {
      type: PostActions.REQ_POSTS
    };
  }

  static REQ_POSTS_FAIL = `[Post] Request Posts Fail`;
  reqPostsFail(err: ServerError): Action {
    return {
      type: PostActions.REQ_POSTS_FAIL,
      payload: err
    };
  }

  static REQ_POSTS_SUCCESS = `[Post] Request Posts Success`;
  reqPostsSuccess(posts: Post[]): Action {
    return {
      type: PostActions.REQ_POSTS_SUCCESS,
      payload: posts
    };
  }

  static FILTERS_TOGGLE_CATEGORY = `[Post] Filters Toggle Category`;
  filtersToggleCategory(id: number): Action {
    return {
      type: PostActions.FILTERS_TOGGLE_CATEGORY,
      payload: id
    };
  }

  static SET_READING_POST = `[Post] Set Reading Post`;
  setReadingPost(slug: string): Action {
    return {
      type: PostActions.SET_READING_POST,
      payload: slug
    };
  }

  static REQ_POST_BY_SLUG = `[Post] Req Post By Slug`;
  reqPostBySlug(slug: string): Action {
    return {
      type: PostActions.REQ_POST_BY_SLUG,
      payload: slug
    };
  }

  static REQ_POST_BY_SLUG_FAIL = `[Post] Req Post By Slug Fail`;
  reqPostBySlugFail(err: ServerError): Action {
    return {
      type: PostActions.REQ_POST_BY_SLUG_FAIL,
      payload: err
    };
  }

  static REQ_POST_BY_SLUG_SUCCESS = `[Post] Req Post By Slug Success`;
  reqPostBySlugSuccess(post: Post): Action {
    return {
      type: PostActions.REQ_POST_BY_SLUG_SUCCESS,
      payload: post
    };
  }
}
