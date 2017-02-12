import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/delay';

import { RequestBase } from '../../services/request-base';

import { Post } from './post.model';
import { PostFilters } from './post-filters.model';
import { PAGE_SIZE } from './post.constants';

const POSTS: Post[] = require('../../../assets/mock-data/posts.json');

@Injectable()
export class FakePostService {

  getPostsByFilters(filters: PostFilters): Observable<Post[]> {
    let posts: Post[] = POSTS.filter((post: Post) => this.filterPost(post, filters));
    if (posts.length > PAGE_SIZE) {
      posts = posts.slice(0, PAGE_SIZE);
    }
    return Observable.of(posts).delay(200).catch(RequestBase.handleError);
  }

  private filterPost(post: Post, filters: PostFilters): boolean {
    if (filters.categories && filters.categories.length
      && !post.categories.some((cid: number) => filters.categories.includes(cid))) {
      return false;
    }
    return true;
  }
}
