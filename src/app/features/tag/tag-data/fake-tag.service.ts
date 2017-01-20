import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/delay';

import { RequestBase } from '../../../services/request-base';

import { Tag } from './tag.model';

const TAGS: Tag[] = require('../../../../assets/mock-data/tags.json');

@Injectable()
export class FakeTagService {

  getAllTags(): Observable<Tag[]> {
    return Observable.of(TAGS).catch(RequestBase.handleError);
  }
}
