import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs/Subject';

import { AppState } from '../../../reducers';
import { Category } from '../../category';

import { FullPost, FullPostActions } from '../post-data';
import { ANIMATIONS } from './post-full.animations';

@Component({
  selector: 'post-full',
  templateUrl: 'post-full.component.html',
  styleUrls: [ './post-full.component.css' ],
  animations: ANIMATIONS
})
export class PostFullComponent implements OnInit, OnDestroy {

  categories: Category[];
  circleAnimationEnd: boolean = false;
  post: FullPost;
  private destroyed$: Subject<any> = new Subject<any>();

  constructor(
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private fullPostActions: FullPostActions
  ) { }

  getCategories(): void {
    this.store.select((state: AppState) => state.category.categories)
      .take(1)
      .subscribe((cats: Category[]) => {
        this.categories = cats.filter((cat: Category) => this.post.categories.indexOf(cat.id) > -1);
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
  }

  ngOnInit(): void {
    this.route.params
      .takeUntil(this.destroyed$)
      .subscribe((params: Params) => this.store.dispatch(this.fullPostActions.loadPostBySlug(params['slug'])));

    this.store.select((state: AppState) => state.post.full.currentPost)
      .takeUntil(this.destroyed$)
      .subscribe((post: FullPost) => {
        if (post) {
          this.post = post;
          this.getCategories();
        }
      })
  }

  onCircleEnd(): void {
    this.circleAnimationEnd = true;
  }
}
