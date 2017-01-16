import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import { AppState } from '../../reducers';
import { NavigationActions } from '../../core';

@Component({
  selector: 'lazy-navigation',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [ './navigation.component.css' ],
  templateUrl: 'navigation.component.html'
})
export class NavigationComponent implements OnInit, OnDestroy {

  showNav$: Observable<boolean>;
  private destroyed$: Subject<void> = new Subject<void>();

  constructor(
    private store: Store<AppState>,
    private navigationActions: NavigationActions
  ) { }

  ngOnInit(): void {
    this.showNav$ = this.store.select((s: AppState) => s.navigation.isOpen).takeUntil(this.destroyed$);
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
  }

  toggle(): void {
    this.store.dispatch(this.navigationActions.toggleNavigation());
  }
}