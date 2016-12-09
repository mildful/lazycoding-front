/* tslint:disable: member-ordering */
import { Injectable } from '@angular/core';
import { Actions, Effect, toPayload } from '@ngrx/effects';
import { Store, Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { AppState } from '../../../../reducers';
import { ServerError } from '../../../../services/server-error.model';
import { PostService } from '../post.service';
import { FullPostActions } from './full-post.actions';
import { FullPost } from './full-post.model';

@Injectable()
export class FullPostEffects {

  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private postService: PostService,
    private fullPostActions: FullPostActions
  ) { }

  @Effect({ dispatch: false }) fetchPost$ = this.actions$
    .ofType(FullPostActions.LOAD_POST_BY_SLUG)
    .do(() => this.store.dispatch( this.fullPostActions.loadPostFromCache() ))
    .do(() => this.store.select((state: AppState) => state.post.full.slug)
      .take(1)
      .subscribe((slug: string) => {
        if (slug) {
          this.store.dispatch( this.fullPostActions.reqPostBySlug(slug) );
        } else {
          this.store.dispatch( this.fullPostActions.loadPostBySlugSuccess() );
        }
      })
    );

  @Effect() loadEnd$ = this.actions$
    .ofType(...[
      FullPostActions.REQ_POST_BY_SLUG_SUCCESS,
      FullPostActions.REQ_POST_BY_SLUG_FAIL
    ])
    .switchMap((action: Action) => this.store.select((state: AppState) => state.post.full.loading)
      .take(1)
      .mergeMap((loading: boolean) => {
        if (loading) {
          return action.type === FullPostActions.REQ_POST_BY_SLUG_SUCCESS
            ? Observable.of( this.fullPostActions.loadPostBySlugSuccess() )
            : Observable.of( this.fullPostActions.loadPostBySlugFail() );
        } return Observable.never();
      })
    );

  @Effect() reqPosts$ = this.actions$
    .ofType(FullPostActions.REQ_POST_BY_SLUG)
    .map(toPayload)
    .switchMap((slug: string) => this.postService.getFullPostBySlug(slug)
      .mergeMap((post: FullPost) => Observable.of(
        this.fullPostActions.reqPostBySlugSuccess(post)
      ))
      .retry(2)
      .catch((err: ServerError) => Observable.of(
        this.fullPostActions.reqPostBySlugFail(err)
      ))
    );

  @Effect() cachePosts$ = this.actions$
    .ofType(FullPostActions.REQ_POST_BY_SLUG_SUCCESS)
    .map(toPayload)
    .mergeMap((post: FullPost) => Observable.of(
      this.fullPostActions.cachePost(post)
    ));
}
