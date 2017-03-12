import { Component, OnInit, OnDestroy, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import {
  trigger,
  state,
  style,
  transition,
  animate } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Store } from '@ngrx/store';

import { AppState } from '../../../reducers';
import { getState } from '../../../reducers/store-utils';
import { MOBILE } from '../../../services/constants';
import {
  Post, PostActions,
  Category
} from '../../../core';

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
    <div class="loader" *ngIf="requesting$ | async">
      <list-loader></list-loader>
    </div>
    <category-list></category-list>
    <h2 *ngIf="!mobile" class="list-title">{{ title }}</h2>
    <section class="posts">
      <post-card *ngFor="let post of posts$ | async" 
        [post]="post" 
        [@appear]="postsAnimationsState.get(post.id)">
      </post-card>
      <div #trigger class="load-trigger"></div>
    </section>
  `
})
export class PostListComponent implements OnInit, OnDestroy {

  mobile: boolean = MOBILE;
  /**
   * Posts to display in the list.
   * @type {Observable<Post[]>}
   */
  posts$: Observable<Post[]>;
  postsAnimationsState: Map<number, string> = new Map<number, string>();
  requesting$: Observable<boolean>;
  load$: Subject<void> = new Subject<void>();
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

  constructor(
    private store: Store<AppState>,
    private postActions: PostActions,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    // loader
    this.requesting$ = this.store.select((s: AppState) => s.post.requesting)
      .takeUntil(this.destroyed$);

    // url management
    this.route.params
      .takeUntil(this.destroyed$)
      .subscribe((params: Params) => {
        if (params['categories'] && params['categories'].length) {
          const categories: number[] = Array.isArray(params['categories'])
            ? params['categories']
            : params['categories'].split(',').map((id: string) => +id);
          this.store.dispatch(this.postActions.filtersToggleCategory(categories));
        } else {
          this.store.dispatch(this.postActions.resetCategoryFilter());
        }

        //todo: multiple call
        this.store.dispatch(this.postActions.reqPosts());
      });

    // trigger management
    const io = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
      if (entries[0].intersectionRatio <= 0) return;
      this.load$.next();
    });
    io.observe(this.trigger.nativeElement);
    this.load$
      .takeUntil(this.destroyed$)
      .filter(() => getState(this.store).post.requesting === false)
      .filter(() => getState(this.store).post.complete === false)
      .subscribe( () => this.store.dispatch(this.postActions.reqPosts()) );

    // observe posts
    this.posts$ = this.store.select((s: AppState) => s.post.posts)
      .filter((posts: Post[]) => posts.length > 0)
      .do(this.animatePosts.bind(this));

    // title management
    let categoryTitles: {id: number, title: string}[] = [];
    this.store.select((state: AppState) => state.category.categories)
      .filter((cs: Category[]) => cs.length > 0)
      .take(1)
      .subscribe((cs: Category[]) => categoryTitles = cs.map((c: Category) => { return { id: c.id, title: c.name } }));
    this.store.select((state: AppState) => state.post.filters.categories)
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

  private animatePosts(posts: Post[]): void {
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
        this.postsAnimationsState.set(post.id, 'out');
        setTimeout(() => {
          this.postsAnimationsState.set(post.id, 'in');
        },  i * 200);
      }
    });
  }
}
