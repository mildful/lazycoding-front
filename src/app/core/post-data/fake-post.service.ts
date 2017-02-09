import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/delay';

import { RequestBase } from '../../services/request-base';

import { LitePost, LitePostFilters, PAGE_SIZE } from './lite-post';
import { FullPost } from './full-post';

const LITE_POSTS: LitePost[] = require('../../../assets/mock-data/lite-posts.json');
const FULL_POSTS: FullPost[] = require('../../../assets/mock-data/full-posts.json');

@Injectable()
export class FakePostService {

  getFullPostBySlug(slug: string): Observable<FullPost> {
    const post: FullPost = FULL_POSTS.find((p: FullPost) => p.slug.includes(slug));
    return Observable.of(post).delay(200).catch(RequestBase.handleError);
  }

  getLitePosts(filters: LitePostFilters): Observable<LitePost[]> {
    let posts: LitePost[] = LITE_POSTS.filter((post: LitePost) => this.filterPost(post, filters));
    if (posts.length > PAGE_SIZE) {
      posts = posts.slice(0, PAGE_SIZE);
    }
    return Observable.of(posts).delay(200).catch(RequestBase.handleError);
  }

  private filterPost(post: LitePost, filters: LitePostFilters): boolean {
    if (filters.categories && filters.categories.length
      && !post.categories.some((cid: number) => filters.categories.includes(cid))) {
      return false;
    }
    return true;
  }
}
