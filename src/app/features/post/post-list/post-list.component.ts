import { Component, OnDestroy, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Store } from '@ngrx/store';
import Timer = NodeJS.Timer;

import { WindowRef } from '../window-ref';
import { AppState } from '../../../reducers';

import { Post, PostActions, PostFilters } from '../post-data';

@Component({
  selector: 'post-list',
  styleUrls: [ './post-list.style.css' ],
  encapsulation: ViewEncapsulation.None,
  template: `
    <section class="posts">
      <post-card *ngFor="let post of posts$ | async" [post]="post"></post-card>
      <div #trigger class="pl-trigger"></div>
    </section>
  `
})
export class PostListComponent implements OnDestroy {

  filters$: Observable<PostFilters>;
  pauser$: Subject<boolean> = new Subject<boolean>();
  posts$: Observable<Post[]>;
  requesting$: Observable<boolean>;
  scroll$: Observable<Event>;
  @ViewChild('trigger') trigger: ElementRef;
  private destroyed$: Subject<any> = new Subject<any>();
  private page: number = 0;
  private timeout: Timer = null;

  constructor(
    private store: Store<AppState>,
    private postActions: PostActions,
    private windowRef: WindowRef
  ) {
    // subscribe to post
    this.posts$ = this.store.select((state: AppState) => state.post.posts)
      .takeUntil(this.destroyed$);
    // listen scroll
    this.requesting$ = this.store.select((state: AppState) => state.post.requesting)
      .takeUntil(this.destroyed$);
    this.scroll$ = Observable.fromEvent(this.windowRef.nativeWindow, 'scroll')
      .takeUntil(this.destroyed$)
      .throttleTime(300);
    // concat
    const loader$: Observable<[boolean, Event]> =
      Observable.combineLatest(this.requesting$, this.scroll$, this.canLoad.bind(this))
        .takeUntil(this.destroyed$);
    // delay
    this.pauser$.switchMap((paused: boolean) => paused ? Observable.never() : loader$)
      .takeUntil(this.destroyed$)
      .subscribe((canLoad: [boolean, Event]) => canLoad ? this.load() : null);
    // used to prevent unnecessary request & first load
    this.store.select((state: AppState) => state.post.complete)
      .takeUntil(this.destroyed$)
      .subscribe((complete: boolean) => {
        if (this.timeout) {
          clearTimeout(this.timeout);
          this.timeout = null;
        }
        this.pauser$.next(complete);
      });
    // first load
    this.load();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
  }

  private load(initialLoad: boolean = false): void {
    /*if(initialLoad) {
      // listen to this.source$
      this.pauser$.next(false);
    } else {
      // disable loading for 600ms
      this.pauser$.next(true);
      setTimeout(() => this.pauser$.next(false), 600);
    }*/
    // disable loading for 600ms
    this.pauser$.next(true);
    this.timeout = setTimeout(() => {
      this.pauser$.next(false);
      this.timeout = null;
    }, 600);
    // dispatch action
    const filters: PostFilters = {
      page: ++this.page
    };
    this.store.dispatch(this.postActions.reqPosts(filters));
  }

  private canLoad(requesting: boolean, scroll: Event): boolean {
    if (requesting) return false;
    const offset: number = 300;
    const rect: ClientRect = this.trigger.nativeElement.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (this.windowRef.nativeWindow.innerHeight || document.documentElement.clientHeight) + offset &&
      rect.right <= (this.windowRef.nativeWindow.innerWidth || document.documentElement.clientWidth)
    );
  }
}
