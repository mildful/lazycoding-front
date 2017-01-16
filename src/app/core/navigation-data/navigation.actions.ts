/* tslint:disable: member-ordering */
import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';

@Injectable()
export class NavigationActions {

  static TOGGLE_NAVIGATION = '[Navigation] Toggle Navigation';
  toggleNavigation(): Action {
    return {
      type: NavigationActions.TOGGLE_NAVIGATION
    };
  }

  static CLOSE_NAVIGATION = '[Navigation] Close Navigation';
  closeNavigation(): Action {
    return {
      type: NavigationActions.CLOSE_NAVIGATION
    };
  }
}
