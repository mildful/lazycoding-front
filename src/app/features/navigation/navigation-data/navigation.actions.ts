/* tslint:disable: member-ordering */
import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';

@Injectable()
export class NavigationActions {

  static TOGGLE_NAVIGATION = '[Navigation] Toggle Navigation';
  toggleNavigationn(): Action {
    return {
      type: NavigationActions.TOGGLE_NAVIGATION
    };
  }
}
