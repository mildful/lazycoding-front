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

import { Post, PostActions } from '../post-data';

@Component({
  selector: 'post-full',
  templateUrl: 'post-full.component.html',
  styleUrls: [ './post-full.component.css' ],
  animations: [
    trigger('circle', [
      state('in', style({
        width: '142%',
        height: '142%'
      })),
      transition(':enter', [
        style({
          width: '20px',
          height: '20px'
        }),
        animate('400ms ease-in-out')
      ])
    ])
  ]
})
export class PostFullComponent implements OnInit {

  circleAnimationEnd: boolean = false;
  post: Post;

  constructor(
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private postActions: PostActions
  ) { }

  ngOnInit(): void {
    this.route.params
      .switchMap((params: Params) => this.store.select((state: AppState) =>
          //state.post.cache.find((post: Post) => post.slug.includes(params['slug'])) || params['slug']
        state.post.currentPost || params['slug']
      ))
      .subscribe((postOrSlug: Post | string) => {
        //if(typeof postOrSlug === 'string') this.store.dispatch(this.postActions.loadPostBySlug(postOrSlug));
        //else this.post = postOrSlug;
      });
  }

  onCircleEnd(): void {
    this.circleAnimationEnd = true;
  }
}
