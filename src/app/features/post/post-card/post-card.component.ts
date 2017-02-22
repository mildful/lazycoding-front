import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { AppState } from '../../../reducers';

import {
  Post,
  Category
} from '../../../core';
import { getState } from '../../../reducers/store-utils';
import { toggleArrayValues } from '../../../services/utils';

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
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.store.select((state: AppState) => state.category.categories)
      .take(1)
      .subscribe((cats: Category[]) => {
        this.categories = cats.filter((cat: Category) => this.post.categories.indexOf(cat.id) > -1);
      });
  }

  onCategoryClick(id: number): void {
    // todo: refractor, smart & dumb
    const currentCategories: number[] = this.route.snapshot.params['categories']
      ? this.route.snapshot.params['categories']
      : [];

    if (getState(this.store).post.requesting === false) {
      const categories: number[] = toggleArrayValues(currentCategories, [ id ]);
      if (categories.length) {
        this.router.navigate(['./', { categories }]);
      } else {
        this.router.navigate(['./']);
      }
    }
  }
}
