/* tslint:disable: member-ordering */
import { Injectable } from '@angular/core';
import { Actions, Effect, toPayload } from '@ngrx/effects';
import { Store } from '@ngrx/store';
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
