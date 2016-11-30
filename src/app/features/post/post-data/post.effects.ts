/* tslint:disable: member-ordering */
import { Injectable } from '@angular/core';
import { Actions, Effect, toPayload } from '@ngrx/effects';
import { Store, Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { AppState } from '../../../reducers';
import { ServerError } from '../../../services/server-error.model';
import { PostActions } from './post.actions';
import { PostService } from './post.service';
import { PostFilters } from './post-filters.model';
import { PostResponse } from './post-response.model';

@Injectable()
export class PostEffects {

  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private postService: PostService,
    private postActions: PostActions
  ) { }

  @Effect() load$ = this.actions$
    .ofType(PostActions.LOAD_POSTS)
    .do(() => Observable.of(
      this.postActions.loadPostsFromCache()
    ))
    .switchMap(() => this.store.select((state: AppState) => state.post.filters)
      .take(1)
      .mergeMap((filters: PostFilters) => Observable.of(
        this.postActions.reqPosts(filters)
      ))
    );

  @Effect() loadEnd$ = this.actions$
    .ofType(...[
      PostActions.REQ_POSTS_SUCCESS,
      PostActions.REQ_POSTS_FAIL
    ])
    .switchMap((action: Action) => this.store.select((state: AppState) => state.post.loading)
      .take(1)
      .mergeMap((loading: boolean) => {
        if (loading) {
          return action.type === PostActions.REQ_POSTS_SUCCESS
          ? Observable.of( this.postActions.loadPostsSuccess() )
          : Observable.of( this.postActions.loadPostsFail() );
        }
      })
    );

  @Effect() cachePosts$ = this.actions$
    .ofType(PostActions.REQ_POSTS_SUCCESS)
    .map(toPayload)
    .mergeMap((res: PostResponse) => Observable.of(
      this.postActions.cachePosts(res.posts)
    ))

  @Effect() getPosts$ = this.actions$
    .ofType(PostActions.REQ_POSTS)
    .map(toPayload)
    .switchMap((filters: PostFilters) => this.postService.getPosts(filters)
      .mergeMap((res: PostResponse) => Observable.of(
        this.postActions.reqPostsSuccess(res)
      ))
      .retry(2)
      .catch((err: ServerError) => Observable.of(
        this.postActions.reqPostsFail(err)
      ))
    );
}
