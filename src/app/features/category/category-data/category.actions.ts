/* tslint:disable: member-ordering */
import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';

import { ServerError } from '../../../services/server-error.model';

import { Category } from './category.model';

@Injectable()
export class CategoryActions {

  static REQ_ALL_CATEGORIES = '[Category] Request All Categories';
  reqCategories(): Action {
    return {
      type: CategoryActions.REQ_ALL_CATEGORIES
    };
  }

  static REQ_CATEGORIES_FAIL = '[Category] Request Categories Fail';
  reqCategoriesFail(err: ServerError): Action {
    return {
      type: CategoryActions.REQ_CATEGORIES_FAIL,
      payload: err
    };
  }

  static REQ_CATEGORIES_SUCCESS = '[Category] Request Categories Success';
  reqCategoriesSuccess(categories: Category[]): Action {
    return {
      type: CategoryActions.REQ_CATEGORIES_SUCCESS,
      payload: categories
    };
  }
}
