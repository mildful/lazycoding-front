import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { RequestBase } from '../../../services/request-base';
import { API_BASE_URL } from '../../../services/constants';

import { Tag } from './tag.model';

@Injectable()
export class TagService extends RequestBase {

  constructor(public http: Http) {
    super(http);
  }

  getAllTags(): Observable<Tag[]> {
    return this.http.get(`${API_BASE_URL}/tags`)
      .map(RequestBase.toJson);
  }
}
