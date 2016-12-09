/* tslint:disable: member-ordering */
import { Injectable } from '@angular/core';
import { Actions, Effect, toPayload } from '@ngrx/effects';
import { Store, Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { AppState } from '../../../../reducers';
import { ServerError } from '../../../../services/server-error.model';

import { PostService } from '../post.service';
import { LitePostActions } from './lite-post.actions';
import { LitePostFilters } from './lite-post-filters.model';
import { LitePostResponse } from './lite-post-response.model';

@Injectable()
export class LitePostEffects {

  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private postService: PostService,
    private litePostActions: LitePostActions
  ) { }

  @Effect() load$ = this.actions$
    .ofType(LitePostActions.FILTERS_TOGGLE_CATEGORY)
    .switchMap(() => Observable.of(
      this.litePostActions.loadPosts()
    ));

  @Effect({ dispatch: false }) fetchPosts$ = this.actions$
    .ofType(LitePostActions.LOAD_POSTS)
    .do(() => this.store.dispatch( this.litePostActions.loadPostsFromCache() ))
    .do(() => this.store.select((state: AppState) => state.post.lite.filters)
      .take(1)
      .subscribe((filters: LitePostFilters) => {
        if (filters.remaining > 0) {
          this.store.dispatch( this.litePostActions.reqPosts(filters) );
        } else {
          this.store.dispatch( this.litePostActions.loadPostsSuccess() );
        }
      })
    );

  @Effect() loadEnd$ = this.actions$
    .ofType(...[
      LitePostActions.REQ_POSTS_SUCCESS,
      LitePostActions.REQ_POSTS_FAIL
    ])
    .switchMap((action: Action) => this.store.select((state: AppState) => state.post.lite.loading)
      .take(1)
      .mergeMap((loading: boolean) => {
        if (loading) {
          return action.type === LitePostActions.REQ_POSTS_SUCCESS
          ? Observable.of( this.litePostActions.loadPostsSuccess() )
          : Observable.of( this.litePostActions.loadPostsFail() );
        } return Observable.never();
      })
    );

  @Effect() cachePosts$ = this.actions$
    .ofType(LitePostActions.REQ_POSTS_SUCCESS)
    .map(toPayload)
    .mergeMap((res: LitePostResponse) => res.posts.length
      ? Observable.of( this.litePostActions.cachePosts(res.posts) )
      : Observable.never()
    );

  @Effect() reqPosts$ = this.actions$
    .ofType(LitePostActions.REQ_POSTS)
    .map(toPayload)
    .switchMap((filters: LitePostFilters) => this.postService.getPosts(filters)
      .mergeMap((res: LitePostResponse) => Observable.of(
        this.litePostActions.reqPostsSuccess(res)
      ))
      .retry(2)
      .catch((err: ServerError) => Observable.of(
        this.litePostActions.reqPostsFail(err)
      ))
    );
}
