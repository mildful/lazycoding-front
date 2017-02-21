/* tslint:disable: member-ordering */
import { Injectable } from '@angular/core';
import {Actions, Effect, toPayload} from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { AppState } from '../../reducers';
import { getState } from '../../reducers/store-utils';
import { ServerError } from '../../services/server-error.model';

import { PostService } from './post.service';
import { PostActions } from './post.actions';
import { PostFilters } from './post-filters.model';
import { Post } from './post.model';

@Injectable()
export class PostEffects {

  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private postService: PostService,
    private postActions: PostActions
  ) { }

  @Effect() reqPosts$ = this.actions$
    .ofType(PostActions.REQ_POSTS)
    .map(() => getState(this.store).post.filters)
    .switchMap((filters: PostFilters) => this.postService.getPostsByFilters(filters)
      .mergeMap((posts: Post[]) => Observable.of(
        this.postActions.reqPostsSuccess(posts)
      ))
      .retry(2)
      .catch((err: ServerError) => Observable.of(
        this.postActions.reqPostsFail(err)
      ))
    );

  @Effect() reqPostBySlug$ = this.actions$
    .ofType(PostActions.REQ_POST_BY_SLUG)
    .map(toPayload)
    .switchMap((slug: string) => this.postService.getPostBySlug(slug)
      .mergeMap((post: Post) => Observable.of(
        this.postActions.reqPostBySlugSuccess(post)
      ))
      .retry(2)
      .catch((err: ServerError) => Observable.of(
        this.postActions.reqPostBySlugFail(err)
      ))
    );

  @Effect() autoReqPosts$ = this.actions$
    .ofType(PostActions.FILTERS_TOGGLE_CATEGORY)
    .throttleTime(250)
    .mergeMap(() => Observable.of(
      this.postActions.reqPosts()
    ));
}
