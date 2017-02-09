/* tslint:disable: quotemark */
import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs/Subject';

import { AppState } from '../../reducers';

import { OverlayConfig } from './overlay-config.model';
import { OverlayActions } from '../../core/overlay-data/overlay.actions';
import { OverlayState } from '../../core/overlay-data/overlay.reducer';
import { ANIMATIONS } from './overlay.animations';

@Component({
  selector: 'lazy-overlay',
  template: `
    <div class="wrapper" [@bg]="'in'" *ngIf="src" (click)="close($event)">
      <div class="card" (click)="preventPropagation($event)">
        <img [src]="src" alt="overlay" />
        <div>
          <a  href="#" class="closeButton" (click)="close($event)">[x] {{ closeTexts[closeIndex] }}</a>
        </div>
      </div>
    </div>
  `,
  styleUrls: [ './overlay.component.css' ],
  animations: ANIMATIONS
})
export class OverlayComponent implements OnDestroy {

  closeIndex: number;
  closeTexts: string[] = [ "j'ai vu !", "fermer", "fuyez, pauvres fous", "ok.", "cool :-)" ];
  config: OverlayConfig;
  src: string;
  private destroyed$: Subject<any> = new Subject<any>();

  constructor (
    private store: Store<AppState>,
    private overlayActions: OverlayActions
  ) {
    this.store.select((s: AppState) => s.overlay)
      .takeUntil(this.destroyed$)
      .subscribe((state: OverlayState) => {
        this.src = state.src;
        this.config = state.config;
        this.closeIndex = Math.floor(Math.random() * (this.closeTexts.length - 1));
      });
  }

  close(e: MouseEvent): void {
    e.preventDefault();
    e.stopPropagation();

    if (this.config && this.config.easyClosing) {
      this.store.dispatch(this.overlayActions.closeOverlay());
    }
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
  }

  preventPropagation(e: MouseEvent): void {
    if (!(e.target as HTMLElement).classList.contains('closeButton')) {
      e.stopPropagation();
    }
  }
}
