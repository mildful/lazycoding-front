import { Component, ViewEncapsulation, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import { AppState } from '../../reducers';
import { NavigationActions } from '../../core';
import { WindowRef } from '../../shared';
import { MOBILE } from '../../services/constants';

@Component({
  selector: 'lazy-navigation',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [ './navigation.component.css' ],
  templateUrl: 'navigation.component.html'
})
export class NavigationComponent implements OnInit, OnDestroy {

  hideHeaderNav: boolean = false;
  @ViewChild('navWrapper') navWrapper: ElementRef;
  showNav$: Observable<boolean>;
  private destroyed$: Subject<void> = new Subject<void>();

  constructor(
    private store: Store<AppState>,
    private navigationActions: NavigationActions,
    private windowRef: WindowRef
  ) { }

  ngOnInit(): void {
    this.showNav$ = this.store.select((s: AppState) => s.navigation.isOpen).takeUntil(this.destroyed$);
    if (MOBILE) {
      this.enableAutoHide();
    }
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
  }

  toggle(): void {
    this.store.dispatch(this.navigationActions.toggleNavigation());
  }

  private enableAutoHide(): void {
    const headerHeight: number = this.navWrapper.nativeElement.offsetHeight;
    let previousScroll: number = 0;

    let scroll$: Observable<Event> = Observable.fromEvent(this.windowRef.nativeWindow, 'scroll')
      .throttleTime(100);

    // can minimize ?
    Observable.combineLatest(this.showNav$, scroll$, (showNav: boolean, e: Event) => {
        if (showNav) return false;
        let res: boolean = false;
        const currentScroll: number = this.windowRef.nativeWindow.pageYOffset || document.documentElement.scrollTop;
        if (currentScroll > headerHeight) {
          res = currentScroll > previousScroll;
        } else {
          res = false;
        }
        previousScroll = currentScroll;
        return res;
      })
      .takeUntil(this.destroyed$)
      .subscribe((canMinimize: boolean) => this.hideHeaderNav = canMinimize);
  }
}