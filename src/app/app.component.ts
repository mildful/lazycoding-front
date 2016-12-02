import { Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { AppState } from './reducers/index';
import { CategoryActions } from './features/category';
import { MOBILE } from './services/constants';

@Component({
  selector: 'lc-app',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './app.component.html'
})
export class AppComponent {
  showMonitor = (ENV === 'development' && !AOT &&
    ['monitor', 'both'].includes(STORE_DEV_TOOLS) // set in constants.js file in project root
  );
  contentWidth: string = this.showMonitor ? '70%' : '';
  mobile = MOBILE;

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    private store: Store<AppState>,
    private categoryActions: CategoryActions
  ) {
    this.load();
  }

  activateEvent(event) {
    if (ENV === 'development') {
      console.log('Activate Event:', event);
    }
  }

  deactivateEvent(event) {
    if (ENV === 'development') {
      console.log('Deactivate Event', event);
    }
  }

  private load(): void {
    this.store.dispatch(this.categoryActions.reqCategories());
  }
}
