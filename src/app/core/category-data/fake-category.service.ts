import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/delay';

import { RequestBase } from '../../services/request-base';

import { Category } from './category.model';

const CATEGORIES: Category[] = require('../../../assets/mock-data/categories.json');

@Injectable()
export class FakeCategoryService {

  getAllCategories(): Observable<Category[]> {
    return Observable.of(CATEGORIES).catch(RequestBase.handleError);
  }
}