import { Component, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { AppState } from '../../../reducers/index';
import { Category } from '../../../core';
import { getState } from '../../../reducers/store-utils';
import { toggleArrayValues } from '../../../services/utils';

@Component({
  selector: 'category-list',
  template: `
    <ul class="categories">
      <li *ngFor="let category of categories$ | async" 
          (click)="onClick(category.id)">
        <lazy-dot [img]="category.custom_image" 
                [alt]="category.slug"
                [wrapperClasses]="category.slug"
                [selected]="currentFiltersCategory.includes(category.id)">
          <lazy-dot-content [position]="'right'">{{ category.name }}</lazy-dot-content>
        </lazy-dot>
      </li>
    </ul>
  `,
  styleUrls: [ './category-list.component.css' ]
})
export class CategoryListComponent implements OnDestroy {

  categories$: Observable<Category[]>;
  currentFiltersCategory: number[];
  private destroyed$: Subject<any> = new Subject<any>();

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.categories$ = this.store.select((state: AppState) => state.category.categories);
    this.store.select((state: AppState) => state.post.filters.categories)
      .takeUntil(this.destroyed$)
      .subscribe((categories: number[]) => this.currentFiltersCategory = categories);
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
  }

  onClick(id: number): void {
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
