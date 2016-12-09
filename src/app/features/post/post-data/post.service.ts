import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';

import { API_BASE_URL } from '../../../services/constants';
import { RequestBase } from '../../../services/request-base';

import {
  LitePostFilters,
  LitePostResponse,
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
      .catch(this.handleError);
  }

  getPosts(filters: LitePostFilters): Observable<LitePostResponse> {
    const url: string = this.buildUrl(`${API_BASE_URL}/posts?per_page=${filters.remaining}`, filters);
    return this.http.get(url)
      .map(RequestBase.toJson)
      .map((posts: LitePost[]) => { return {
        posts,
        complete: posts.length < filters.remaining
      }; } )
      .catch(this.handleError);
  }

  private buildUrl(url: string, filters: LitePostFilters): string {
    // return url if no filters
    if (!filters || !Object.keys(filters).length) return url;

    if (!url.includes('per_page')) url = this.pagerize(url);

    for (let name in filters) {
      if (!name.includes('remaining') && filters.hasOwnProperty(name)) {
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

  private handleError(res: Response): ErrorObservable<string> {
    let msg: string;
    let error: any = res.json();
    if (error instanceof ProgressEvent) {
      msg = 'Unable to connect server.';
    }
    return Observable.throw(msg);
  }

  private pagerize(url: string): string {
    return (url.includes('?'))
      ? url + `&per_page=${PAGE_SIZE}`
      : url + `?per_page=${PAGE_SIZE}`;
  }
}
