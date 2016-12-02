import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Store } from '@ngrx/store';

import { AppState } from '../../../reducers';

import { Post, PostActions } from '../post-data';

@Component({
  selector: 'post-full',
  templateUrl: 'post-full.component.html'
})
export class PostFullComponent implements OnInit {

  post: Post;

  constructor(
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private postActions: PostActions
  ) { }

  ngOnInit(): void {
    this.route.params
      .switchMap((params: Params) => this.store.select((state: AppState) =>
        state.post.cache.find((post: Post) => post.slug.includes(params['slug'])) || params['slug']
      ))
      .subscribe((post: Post | string) => {
        if(typeof post === 'string') this.store.dispatch(this.postActions.loadPostBySlug(post));
        else this.post = post;
      });
  }
}
