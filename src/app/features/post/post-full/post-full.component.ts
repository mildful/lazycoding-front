import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Store } from '@ngrx/store';

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
export class PostFullComponent implements OnInit {

  categories: Category[];
  circleAnimationEnd: boolean = false;
  post: FullPost;

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

  ngOnInit(): void {
    this.route.params
      .switchMap((params: Params) => this.store.select((state: AppState) =>
        state.post.full.currentPost || params['slug']
      ))
      .subscribe((postOrSlug: FullPost | string) => {
        if (typeof postOrSlug === 'string') {
          this.store.dispatch(this.fullPostActions.loadPostBySlug(postOrSlug));
        } else {
          this.post = postOrSlug as FullPost;
          this.getCategories();
        }
      });
  }

  onCircleEnd(): void {
    this.circleAnimationEnd = true;
  }
}
