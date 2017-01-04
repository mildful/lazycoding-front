import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/delay';

import { Tag } from './tag.model';

const TAGS: Tag[] = require('../../../../assets/mock-data/tags.json');

@Injectable()
export class FakeTagService {

  getAllTags(): Observable<Tag[]> {
    return Observable.of(TAGS);
  }
}
