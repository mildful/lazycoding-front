import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { RequestBase } from '../../../services/request-base';
import { API_BASE_URL } from '../../../services/constants';

import { Category } from './category.model';

@Injectable()
export class CategoryService extends RequestBase {

  constructor(public http: Http) {
    super(http);
  }

  getAllCategories(): Observable<Category[]> {
    return this.http.get(`${API_BASE_URL}/categories?exclude=1`)
      .map(RequestBase.toJson)
      .catch(RequestBase.handleError);
  }
}
