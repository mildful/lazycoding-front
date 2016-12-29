/* tslint:disable: member-ordering */
import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';

import { OverlayConfig } from './overlay-config.model';

@Injectable()
export class OverlayActions {

  static OPEN_OVERLAY = '[Overlay] Open Overlay';
  openOverlay(content: any, config?: OverlayConfig): Action {
    return {
      type: OverlayActions.OPEN_OVERLAY,
      payload: { content, config }
    };
  }

  static CLOSE_OVERLAY = '[Overlay] Close Overlay';
  closeOverlay(): Action {
    return {
      type: OverlayActions.CLOSE_OVERLAY
    };
  }
}
