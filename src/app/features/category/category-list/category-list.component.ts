import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { AppState } from '../../../reducers/index';
import { LitePostActions } from '../../../core/post-data/lite-post';

import { Category } from '../category-data';

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

  constructor(private store: Store<AppState>, private litePostActions: LitePostActions) {
    this.categories$ = this.store.select((state: AppState) => state.category.categories);
    this.store.select((state: AppState) => state.post.lite.filters.categories)
      .takeUntil(this.destroyed$)
      .subscribe((categories: number[]) => this.currentFiltersCategory = categories);
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
  }

  onClick(id: number): void {
    this.store.dispatch(this.litePostActions.filtersToggleCategory(id));
  }
}
