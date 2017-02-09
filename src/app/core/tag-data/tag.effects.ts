/* tslint:disable: member-ordering */
import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { AppState } from '../../reducers';
import { ServerError } from '../../services/server-error.model';

import { Tag } from './tag.model';
import { TagActions } from './tag.actions';
import { TagService } from './tag.service';

@Injectable()
export class TagEffects {
  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private tagService: TagService,
    private tagActions: TagActions
  ) { }

  @Effect() getTags$ = this.actions$
    .ofType(TagActions.REQ_ALL_TAGS)
    .switchMap(() => this.tagService.getAllTags()
      .mergeMap((tags: Tag[]) => Observable.of(
        this.tagActions.reqTagsSuccess(tags)
        )
      )
      .retry(2)
      .catch((err: ServerError) => Observable.of(
        this.tagActions.reqTagsFail(err)
      ))
    );
}
