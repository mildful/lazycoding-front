import { Component, OnInit, OnDestroy, AfterViewChecked } from '@angular/core';
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
export class PostFullComponent implements OnInit, OnDestroy, AfterViewChecked {

  categories: Category[];
  circleAnimationEnd: boolean = false;
  html: string = '';
  post: FullPost;
  private destroyed$: Subject<any> = new Subject<any>();
  private highlighted: boolean = false;

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

  ngAfterViewChecked(): void {
    if (!this.highlighted) {
      Prism.highlightAll(false);
      this.highlighted = true;
    }
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
          this.html = this.updateToPrismClasses(this.post.content.rendered);
          this.getCategories();
        }
      })
  }

  onCircleEnd(): void {
    this.circleAnimationEnd = true;
  }

  private findTagsPos(str: string, tagName: string): number[] {
    let indices: number[] = [];
    for(let pos = str.indexOf(tagName); pos !== -1; pos = str.indexOf(tagName, pos + 1)) {
      indices.push(pos);
    }
    return indices;
  }

  private updateToPrismClasses(html: string): string {
    const langs: string[] = ['css', 'javascript', 'html'];
    langs.forEach((lang: string) => {
      html = html.replace(new RegExp(`class="${lang}"`, 'g'), `class="language-${lang}"`);
    });
    return html;
  }
}
