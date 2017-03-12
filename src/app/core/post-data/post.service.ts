import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { API_BASE_URL } from '../../services/constants';
import { RequestBase } from '../../services/request-base';

import { PostFilters } from './post-filters.model';
import { Post } from './post.model';
import { PAGE_SIZE } from './post.constants';

@Injectable()
export class PostService extends RequestBase {

  constructor(public http: Http) {
    super(http);
  }

  getPostsByFilters(filters: PostFilters): Observable<Post[]> {
    const url: string = this.buildUrl(`${API_BASE_URL}/posts?per_page=${PAGE_SIZE}`, filters);
    return this.http.get(url)
      .map(RequestBase.toJson)
      .catch(RequestBase.handleError);
  }

  getPostBySlug(slug: string): Observable<Post> {
    return this.http.get(`${API_BASE_URL}/posts?filter[name]=${slug}`, this.options)
      .map(RequestBase.toJson)
      .map((posts: Post[]) => posts[0])
      .catch(RequestBase.handleError);
  }

  private buildUrl(url: string, filters: PostFilters): string {
    // todo: http://localhost/lazycoding-back/wp-json/wp/v2/posts?filter[category__and][]=3&filter[category__and][]=5
    // return url if no filters
    if (!filters || !Object.keys(filters).length) return url;

    let formattedFilters: any = Object.assign({}, filters);

    if (formattedFilters.hasOwnProperty('tag')) {
      formattedFilters.tags = formattedFilters.tag;
      formattedFilters.tag = undefined;
    }

    for (let name in formattedFilters) {
      if (!name.includes('limit') && formattedFilters.hasOwnProperty(name)) {
        const value: any = formattedFilters[name];
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
