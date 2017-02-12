import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { AppState } from '../../../reducers';

import {
  Post, PostActions,
  Category
} from '../../../core';

@Component({
  selector: 'post-card',
  templateUrl: 'post-card.component.html',
  styleUrls: [ './post-card.component.css' ]
})
export class PostCardComponent implements OnInit {

  categories: Category[];
  @Input() post: Post;

  constructor(
    private store: Store<AppState>,
    private postActions: PostActions
  ) {}

  ngOnInit(): void {
    this.store.select((state: AppState) => state.category.categories)
      .take(1)
      .subscribe((cats: Category[]) => {
        this.categories = cats.filter((cat: Category) => this.post.categories.indexOf(cat.id) > -1);
      });
  }

  onCategoryClick(id: number): void {
    this.store.dispatch(this.postActions.filtersToggleCategory(id));
  }
}
