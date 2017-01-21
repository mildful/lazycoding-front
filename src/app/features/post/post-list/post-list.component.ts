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

import { WindowRef } from '../../../shared';
import { AppState } from '../../../reducers';
import { LitePost, LitePostActions } from '../../../core';
import { Category } from '../../category';
import { MOBILE } from '../../../services/constants';

@Component({
  selector: 'post-list',
  styleUrls: [ './post-list.component.css' ],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('appear', [
      state('in', style({
        opacity: 1,
        transform: 'translateY(0)'
      })),
      state('out', style({
        opacity: 0,
        transform: 'translateY(50px)'
      })),
      transition('out => in', animate('500ms ease-in-out'))
    ])
  ],
  template: `
    <h2 *ngIf="!mobile" class="list-title">{{ title }}</h2>
    <section class="posts">
      <post-card *ngFor="let post of posts$ | async" 
        [post]="post" 
        [@appear]="postsAnimationsState.get(post.id)"></post-card>
      <div #trigger class="load-trigger"></div>
    </section>
  `
})
export class PostListComponent implements OnDestroy {

  mobile: boolean = MOBILE;
  /**
   * Used to pause other observables.
   * @type {Subject<boolean>}
   */
  pauser$: Subject<boolean> = new Subject<boolean>();
  /**
   * Posts to display in the list.
   * @type {Observable<Post[]>}
   */
  posts$: Observable<LitePost[]>;
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
   * Post list title dynamically updated.
   * @type {string}
   */
  title: string;
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
    private litePostActions: LitePostActions,
    private windowRef: WindowRef
  ) {
    // subscribe to post
    this.posts$ = this.store.select((state: AppState) => state.post.lite.posts)
      .do(this.animatePosts.bind(this));
    // listen scroll
    this.loading$ = this.store.select((state: AppState) => state.post.lite.loading);
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
    this.store.select((state: AppState) => state.post.lite.complete)
      // we want to apply a special behavior for the initial load (see before :))
      .skip(1)
      .takeUntil(this.destroyed$)
      .subscribe((complete: boolean) => {
        if (this.timeout) {
          this.clearPause();
        }
        this.pauser$.next(complete);
      });
    // first load
    this.store.select((state: AppState) => state.post.lite.complete)
      .take(1)
      .subscribe((complete: boolean) => complete ? null : this.load());

    // title management
    let categoryTitles: {id: number, title: string}[] = [];
    this.store.select((state: AppState) => state.category.categories)
      .take(1)
      .subscribe((cs: Category[]) => categoryTitles = cs.map((c: Category) => { return { id: c.id, title: c.name } }));
    this.store.select((state: AppState) => state.post.lite.filters.categories)
      .takeUntil(this.destroyed$)
      .subscribe((cids: number[]) => {
        if (cids.length) {
          this.title = cids.length > 1 ? 'Categories: ' : 'Categorie: ';
          categoryTitles.forEach((c: {id: number, title: string}) => {
            if (cids.indexOf(c.id) > -1) {
              this.title += c.title + ', ';
            }
          });
          this.title = this.title.slice(0, -2);
        } else this.title = 'Tous les articles';
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
  }

  private animatePosts(posts: LitePost[]): void {
    // we need this because on editing filter category, posts can be blank
    if (!posts.length) return;
    // delete removed posts from animation management
    let ids: number[] = posts.map((post: LitePost) => post.id);
    const it: IterableIterator<number> = this.postsAnimationsState.keys();
    let mapId: number = it.next().value;
    while (mapId) {
      if (!ids.includes(mapId)) this.postsAnimationsState.delete(mapId);
      mapId = it.next().value;
    }
    // trigger animations
    let i: number = 0;
    posts.forEach((post: LitePost) => {
      if (!this.postsAnimationsState.has(post.id)) {
        i++;
        this.postsAnimationsState.set(post.id, 'out');
        setTimeout(() => this.postsAnimationsState.set(post.id, 'in'), i * 200);
      }
    });
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
    this.store.dispatch(this.litePostActions.loadPosts());
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
