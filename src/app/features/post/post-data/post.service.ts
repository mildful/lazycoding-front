import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { API_BASE_URL } from '../../../services/constants';
import { RequestBase } from '../../../services/request-base';

import { PostFilters } from './post-filters.model';
import { PostResponse } from './post-response.model';
import { Post } from './post.model';

@Injectable()
export class PostService extends RequestBase {

  private PAGE_SIZE: number = 12;

  constructor(public http: Http) {
    super(http);
  }

  getPosts(filters: PostFilters): Observable<PostResponse> {
    const url: string = this.buildUrl(`${API_BASE_URL}/posts?per_page=${this.PAGE_SIZE}`, filters);
    return this.http.get(url)
      .map(RequestBase.toJson)
      .map((posts: Post[]) => { return {
        posts,
        complete: posts.length < this.PAGE_SIZE
      }; } );
  }

  private buildUrl(url: string, filters: PostFilters): string {
    // return url if no filters
    if (!filters || !Object.keys(filters).length) return url;

    if (!url.includes('per_page')) url = this.pagerize(url);

    for (let name in filters) {
      if (filters.hasOwnProperty(name)) {
        const value: any = filters[name];
        if (value) {
          const isArray: boolean = Array.isArray(value);
          if (isArray && value.length) {
            url += `&${name}=${value.join(',')}`;
          } else if (!isArray) {
            url += `&${name}=${value}`;
          }
        }
      }
    }
    return url;
  }

  private pagerize(url: string): string {
    return (url.includes('?'))
      ? url + `&per_page=${this.PAGE_SIZE}`
      : url + `?per_page=${this.PAGE_SIZE}`;
  }
}
