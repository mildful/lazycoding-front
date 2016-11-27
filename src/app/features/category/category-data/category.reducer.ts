/* tslint:disable: no-switch-case-fall-through */
import { Action } from '@ngrx/store';

import { ServerError } from '../../../services/server-error.model';

import { CategoryActions } from './category.actions';
import { Category } from './category.model';

export interface CategoryState {
  categories: Category[];
  requesting: boolean;
  error: ServerError;
}

const initialState: CategoryState = {
  categories: [],
  requesting: false,
  error: null,
};

export function categoryReducer(state = initialState, action: Action): CategoryState {
  switch (action.type) {

    /**
     * payload: undefined
     */
    case CategoryActions.REQ_CATEGORIES: {
      return Object.assign({}, state, {
        requesting: true
      });
    }

    /**
     * payload: ServerError
     */
    case CategoryActions.REQ_CATEGORIES_FAIL: {
      return Object.assign({}, state, {
        requesting: false,
        error: action.payload
      });
    }

    /**
     * payload: Category[]
     */
    case CategoryActions.REQ_CATEGORIES_SUCCESS: {
      return Object.assign({}, state, {
        requesting: false,
        categories: action.payload,
        error: null
      });
    }

    default: {
      return state;
    }
  }
}
