/* tslint:disable: member-ordering */
import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { AppState } from '../../../reducers';
import { ServerError } from '../../../services/server-error.model';

import { CategoryActions } from './category.actions';
import { CategoryService } from './category.service';
import { Category } from './category.model';

@Injectable()
export class CategoryEffects {
  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private categoryService: CategoryService,
    private categoryActions: CategoryActions
  ) { }

  @Effect() getCategories$ = this.actions$
    .ofType(CategoryActions.REQ_CATEGORIES)
    .switchMap(() => this.categoryService.getCategories()
      .mergeMap((categories: Category[]) => Observable.of(
        this.categoryActions.reqCategoriesSuccess(categories)
        )
      )
      .retry(2)
      .catch((err: ServerError) => Observable.of(
        this.categoryActions.reqCategoriesFail(err)
      ))
    );
}
