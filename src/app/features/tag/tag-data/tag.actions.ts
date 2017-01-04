/* tslint:disable: member-ordering */
import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';

import { ServerError } from '../../../services/server-error.model';

import { Tag } from './tag.model';

@Injectable()
export class TagActions {

  static REQ_ALL_TAGS = '[Tag] Request All Tags';
  reqAllTags(): Action {
    return {
      type: TagActions.REQ_ALL_TAGS
    };
  }

  static REQ_TAGS_FAIL = '[Tag] Request Tags Fail';
  reqTagsFail(err: ServerError): Action {
    return {
      type: TagActions.REQ_TAGS_FAIL,
      payload: err
    };
  }

  static REQ_TAGS_SUCCESS= '[Tag] Request Tags Success';
  reqTagsSuccess(tags: Tag[]): Action {
    return {
      type: TagActions.REQ_TAGS_SUCCESS,
      payload: tags
    };
  }
}
