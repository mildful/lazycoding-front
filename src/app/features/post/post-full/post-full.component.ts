import { Component, OnInit, OnDestroy, AfterViewChecked, ElementRef } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs/Subject';

import { AppState } from '../../../reducers';
import { OverlayActions, OverlayConfig } from '../../../shared/overlay';
import { Category } from '../../category';
import { Tag } from '../../tag';
import { FullPost, FullPostActions } from '../../../core';

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
  post: FullPost;
  tags: Tag[];
  private destroyed$: Subject<any> = new Subject<any>();
  private postprocessed: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private fullPostActions: FullPostActions,
    private overlayActions: OverlayActions,
    private elementRef: ElementRef
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
      .subscribe((params: Params) => this.store.dispatch(this.fullPostActions.loadPostBySlug(params['slug'])));

    this.store.select((state: AppState) => state.post.full.currentPost)
      .takeUntil(this.destroyed$)
      .subscribe((post: FullPost) => {
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

  private updateToPrismClasses(html: string): string {
    const langs: string[] = ['css', 'javascript', 'html'];
    langs.forEach((lang: string) => {
      html = html.replace(new RegExp(`class='${lang}'`, 'g'), `class='language-${lang}'`);
    });
    return html;
  }
}
