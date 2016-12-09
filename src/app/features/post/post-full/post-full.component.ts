import { Component, OnInit } from '@angular/core';
import {
  trigger,
  state,
  style,
  transition,
  animate } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Store } from '@ngrx/store';

import { AppState } from '../../../reducers';

import { FullPost, FullPostActions } from '../post-data';
import { ANIMATIONS } from './post-full.animations';

@Component({
  selector: 'post-full',
  templateUrl: 'post-full.component.html',
  styleUrls: [ './post-full.component.css' ],
  animations: ANIMATIONS
})
export class PostFullComponent implements OnInit {

  circleAnimationEnd: boolean = false;
  post: FullPost;

  constructor(
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private fullPostActions: FullPostActions
  ) { }

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
        }
      });
  }

  onCircleEnd(): void {
    this.circleAnimationEnd = true;
  }
}
