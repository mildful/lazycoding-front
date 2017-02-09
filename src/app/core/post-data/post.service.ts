import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { API_BASE_URL } from '../../services/constants';
import { RequestBase } from '../../services/request-base';

import {
  LitePostFilters,
  LitePost,
  PAGE_SIZE
} from './lite-post';
import { FullPost } from './full-post';

@Injectable()
export class PostService extends RequestBase {

  constructor(public http: Http) {
    super(http);
  }

  getFullPostBySlug(slug: string): Observable<FullPost> {
    const url: string = `${API_BASE_URL}/posts?per_page=1&slug=${slug}`;
    return this.http.get(url)
      .map(RequestBase.toJson)
      .map((posts: FullPost[]) => posts[0])
      .catch(RequestBase.handleError);
  }

  getLitePosts(filters: LitePostFilters): Observable<LitePost[]> {
    const url: string = this.buildUrl(`${API_BASE_URL}/posts?per_page=${PAGE_SIZE}`, filters);
    return this.http.get(url)
      .map(RequestBase.toJson)
      .catch(RequestBase.handleError);
  }

  private buildUrl(url: string, filters: LitePostFilters): string {
    // return url if no filters
    if (!filters || !Object.keys(filters).length) return url;

    for (let name in filters) {
      if (!name.includes('limit') && filters.hasOwnProperty(name)) {
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
}
