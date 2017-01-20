import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/delay';

import { RequestBase } from '../../services/request-base';

import {
  LitePostFilters,
  LitePostResponse,
  LitePost
} from './lite-post';
import { FullPost } from './full-post';

const LITE_POSTS: LitePost[] = require('../../../assets/mock-data/lite-posts.json');
const FULL_POSTS: FullPost[] = require('../../../assets/mock-data/full-posts.json');

@Injectable()
export class FakePostService {

  getFullPostBySlug(slug: string): Observable<FullPost> {
    const post: FullPost = FULL_POSTS.find((p: FullPost) => p.slug.includes(slug));
    return Observable.of(post).delay(200).catch(RequestBase.handleError);
  }

  getPosts(filters: LitePostFilters): Observable<LitePostResponse> {
    let posts: LitePost[] = LITE_POSTS.filter((post: LitePost) => this.filterPost(post, filters));
    let complete: boolean = false;
    if (posts.length > filters.remaining) {
      posts = posts.slice(0, filters.remaining);
    } else {
      complete = true;
    }
    return Observable.of({ posts, complete }).delay(200).catch(RequestBase.handleError);
  }

  private filterPost(post: LitePost, filters: LitePostFilters): boolean {
    if (filters.before && new Date(post.date) >= new Date(filters.before)) {
      return false;
    }
    if (filters.categories && filters.categories.length
      && !post.categories.some((cid: number) => filters.categories.includes(cid))) {
      return false;
    }
    return true;
  }
}
