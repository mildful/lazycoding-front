import { Component, OnDestroy, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import {
  trigger,
  state,
  style,
  transition,
  animate } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Store } from '@ngrx/store';
import Timer = NodeJS.Timer;

import { WindowRef } from '../window-ref';
import { AppState } from '../../../reducers';

import { Post, PostActions } from '../post-data';

@Component({
  selector: 'post-list',
  styleUrls: [ './post-list.style.css' ],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('appear', [
      state('in', style({
        opacity: 1,
        transform: 'translateY(0)'
      })),
      state('out', style({
        opacity: 0,
        transform: 'translateY(500px)'
      })),
      transition('out => in', animate('400ms ease-in-out'))
    ])
  ],
  template: `
    <category-list></category-list>
    <section class="posts">
      <post-card *ngFor="let post of posts$ | async" 
        [post]="post" 
        [@appear]="postsAnimationsState.get(post.id)"></post-card>
      <div #trigger class="pl-trigger"></div>
    </section>
  `
})
export class PostListComponent implements OnDestroy {

  /**
   * Used to pause other observables.
   * @type {Subject<boolean>}
   */
  pauser$: Subject<boolean> = new Subject<boolean>();
  /**
   * Posts to display in the list.
   * @type {Observable<Post[]>}
   */
  posts$: Observable<Post[]>;
  postsAnimationsState: Map<number, string> = new Map<number, string>();
  /**
   * Track if posts are loading.
   * @type {Observable<boolean>}
   */
  loading$: Observable<boolean>;
  /**
   * Listen to scroll, used to lazyload posts.
   * @type {Observable<Event>}
   */
  scroll$: Observable<Event>;
  /**
   * Reference to a DOM node located at the end of the posts list.
   * It triggers the load of more posts.
   * @type {ElementRef}
   */
  @ViewChild('trigger') trigger: ElementRef;
  /**
   * Design pattern used to unsubscribe to all observables when component is being destroyed.
   * @type {Subject<any>}
   */
  private destroyed$: Subject<any> = new Subject<any>();
  private timeout: Timer = null;

  constructor(
    private store: Store<AppState>,
    private postActions: PostActions,
    private windowRef: WindowRef
  ) {
    // subscribe to post
    this.posts$ = this.store.select((state: AppState) => state.post.posts)
      .do((posts: Post[]) => {
        // we need this because on editing filter category, posts can be blank
        if(!posts.length) return;
        // delete removed posts from animation management
        let ids: number[] = posts.map((post: Post) => post.id);
        const it: IterableIterator<number> = this.postsAnimationsState.keys();
        let mapId: number = it.next().value;
        while (mapId) {
          if (!ids.includes(mapId)) this.postsAnimationsState.delete(mapId);
          mapId = it.next().value;
        }
        // trigger animations
        let i: number = 0;
        posts.forEach((post: Post) => {
          if (!this.postsAnimationsState.has(post.id)) {
            i++;
            this.postsAnimationsState.set(post.id,'out');
            setTimeout(() =>this.postsAnimationsState.set(post.id,'in'), i * 200);
          }
        });
      });
    // listen scroll
    this.loading$ = this.store.select((state: AppState) => state.post.loading);
    this.scroll$ = Observable.fromEvent(this.windowRef.nativeWindow, 'scroll')
      .throttleTime(300);
    // concat
    const loader$: Observable<[boolean, Event]> =
      Observable.combineLatest(this.loading$, this.scroll$, this.canLoad.bind(this));
    // delay
    this.pauser$.switchMap((paused: boolean) => paused ? Observable.never() : loader$)
      .takeUntil(this.destroyed$)
      .subscribe((canLoad: [boolean, Event]) => canLoad ? this.load() : null);
    // used to stop requesting if all posts are loaded (complete)
    this.store.select((state: AppState) => state.post.complete)
      .takeUntil(this.destroyed$)
      .subscribe((complete: boolean) => {
        if (this.timeout) {
          this.clearPause();
        }
        this.pauser$.next(complete);
      });
    // first load
    this.load();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
  }

  private canLoad(loading: boolean, scroll: Event): boolean {
    if (loading) return false;
    const offset: number = 300;
    const rect: ClientRect = this.trigger.nativeElement.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (this.windowRef.nativeWindow.innerHeight || document.documentElement.clientHeight) + offset &&
      rect.right <= (this.windowRef.nativeWindow.innerWidth || document.documentElement.clientWidth)
    );
  }

  private clearPause(): void {
    clearTimeout(this.timeout);
    this.timeout = null;
  }

  private load(): void {
    // disable loading for 600ms. Used to prevent to load the same data twice while Angular is still displaying
    // the result of the first request.
    this.pause(600);
    // dispatch action
    this.store.dispatch(this.postActions.loadPosts());
  }

  /**
   * Prevent for loading data during an amount of time.
   * @param duration
   */
  private pause(duration: number): void {
    this.pauser$.next(true);
    this.timeout = setTimeout(() => {
      this.pauser$.next(false);
      this.timeout = null;
    }, duration);
  }
}
