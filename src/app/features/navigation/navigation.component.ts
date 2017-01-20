import { Component, ViewEncapsulation, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import { AppState } from '../../reducers';
import { NavigationActions } from '../../core';
import { WindowRef } from '../../shared';

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
    this.enableAutoHide();
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

    Observable.fromEvent(this.windowRef.nativeWindow, 'scroll')
      .throttleTime(100)
      .takeUntil(this.destroyed$)
      .subscribe(() => {
        const currentScroll: number = this.windowRef.nativeWindow.pageYOffset || document.documentElement.scrollTop;
        if (currentScroll > headerHeight) {
          this.hideHeaderNav = currentScroll > previousScroll;
        } else {
            this.hideHeaderNav = false;
        }
        previousScroll = currentScroll;
      });
  }
}