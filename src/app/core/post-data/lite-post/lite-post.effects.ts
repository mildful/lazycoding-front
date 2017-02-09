/* tslint:disable: member-ordering */
import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { AppState } from '../../../reducers';
import { getState } from '../../../reducers/store-utils';
import { ServerError } from '../../../services/server-error.model';

import { PostService } from '../post.service';
import { LitePostActions } from './lite-post.actions';
import { LitePostFilters } from './lite-post-filters.model';
import { LitePost } from './lite-post.model';

@Injectable()
export class LitePostEffects {

  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private postService: PostService,
    private litePostActions: LitePostActions
  ) { }

  @Effect() reqPosts$ = this.actions$
    .ofType(LitePostActions.REQ_POSTS)
    .map(() => getState(this.store).post.lite.filters)
    .switchMap((filters: LitePostFilters) => this.postService.getLitePosts(filters)
      .mergeMap((posts: LitePost[]) => Observable.of(
        this.litePostActions.reqPostsSuccess(posts)
      ))
      .retry(2)
      .catch((err: ServerError) => Observable.of(
        this.litePostActions.reqPostsFail(err)
      ))
    );

  @Effect() autoReqPosts$ = this.actions$
    .ofType(LitePostActions.FILTERS_TOGGLE_CATEGORY)
    .throttleTime(250)
    .mergeMap(() => Observable.of(
      this.litePostActions.reqPosts()
    ));
}
