import { Component, OnInit, OnDestroy, AfterViewChecked, ElementRef } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs/Subject';

import { AppState } from '../../../reducers';
import { OverlayConfig } from '../../../shared/overlay';
import { getState } from '../../../reducers/store-utils';
import {
  Post, PostActions,
  Category, Tag,
  OverlayActions
} from '../../../core';

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
  postDate: string;
  html: string = '';
  post: Post;
  tags: Tag[];
  private destroyed$: Subject<any> = new Subject<any>();
  private postprocessed: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private postActions: PostActions,
    private overlayActions: OverlayActions,
    private elementRef: ElementRef,
    private router: Router,
  ) { }

  getCategories(): void {
    this.store.select((state: AppState) => state.category.categories)
      .take(1)
      .subscribe((cats: Category[]) => {
        this.categories = cats.filter((cat: Category) => this.post.categories.indexOf(cat.id) > -1);
      });
  }

  getTags(): void {
    this.store.select((state: AppState) => state.tag.tags)
      .take(1)
      .subscribe((tags: Tag[]) => {
        this.tags = tags.filter((tag: Tag) => this.post.tags.indexOf(tag.id) > -1);
      });
  }

  ngAfterViewChecked(): void {
    if (!this.postprocessed) {
      Prism.highlightAll(false);
      const images: HTMLImageElement[] = this.elementRef.nativeElement.getElementsByTagName('img');
      // squeeze the first image (cover)
      for (let i = 1, length = images.length; i < length; i++) {
        images[i].addEventListener('click', (e: MouseEvent) => {
          const overlayConfig: OverlayConfig = {
            easyClosing: true
          };
          this.store.dispatch(this.overlayActions.openOverlay(images[i].getAttribute('src'), overlayConfig));
        });
      }
      this.postprocessed = true;
    }
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
  }

  ngOnInit(): void {
    this.route.params
      .takeUntil(this.destroyed$)
      .subscribe((params: Params) => this.store.dispatch(this.postActions.setReadingPost(params['slug'])));

    this.store.select((s: AppState) => s.post.missingSlug)
      .filter((slug: string) => slug !== null)
      .takeUntil(this.destroyed$)
      .subscribe((slug: string) => this.store.dispatch(this.postActions.reqPostBySlug(slug)));

    this.store.select((state: AppState) => state.post.readingPost)
      .takeUntil(this.destroyed$)
      .filter((post: Post) => !!post)
      .subscribe((post: Post) => {
        if (post) {
          this.postprocessed = false;
          this.post = post;
          this.postDate = new Date(post.date).toLocaleDateString('fr-FR', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
          this.html = this.updateToPrismClasses(this.post.content.rendered);
          this.getCategories();
          this.getTags();
        }
      });
  }

  onCircleEnd(): void {
    this.circleAnimationEnd = true;
  }

  postsByTag(tagId: number) {
    this.router.navigate(['../', { tag: tagId }]);
  }

  private updateToPrismClasses(html: string): string {
    const langs: string[] = ['css', 'javascript', 'html'];
    langs.forEach((lang: string) => {
      html = html.replace(new RegExp(`class='${lang}'`, 'g'), `class='language-${lang}'`);
    });
    return html;
  }
}
