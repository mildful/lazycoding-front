import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Http, Response } from '@angular/http';
import { ActivatedRoute, Router } from '@angular/router';
import {
  trigger,
  state,
  style,
  transition,
  animate } from '@angular/core';
import { Store } from '@ngrx/store';

import { AppState } from './reducers/index';
import { CategoryActions } from './features/category';
import { MOBILE } from './services/constants';

@Component({
  selector: 'lc-app',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './app.component.html',
  animations: [
    trigger('bgImage', [
      state('hidden', style({ opacity: 0 })),
      state('show', style({ opacity: 1 })),
      transition('hidden => show', [
        // style({ opacity: 1 }),
        animate('600ms ease-in-out')
      ])
    ])
  ]
})
export class AppComponent implements OnInit {
  // utils
  showMonitor = (ENV === 'development' && !AOT &&
    ['monitor', 'both'].includes(STORE_DEV_TOOLS) // set in constants.js file in project root
  );
  contentWidth: string = this.showMonitor ? '70%' : '';
  mobile = MOBILE;
  // other
  bgImageAnimationState: string = 'hidden';
  imageData: any;

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    private store: Store<AppState>,
    private categoryActions: CategoryActions,
    private http: Http,
    private sanitizer: DomSanitizer
  ) {
    this.load();
  }

  activateEvent(event) {
    if (ENV === 'development') {
      console.log('Activate Event:', event);
    }
  }

  deactivateEvent(event) {
    if (ENV === 'development') {
      console.log('Deactivate Event', event);
    }
  }

  ngOnInit(): void {
    /*this.http.get('https://unsplash.it/g/1920/1080/?random=true&blur=true')
      .take(1)
      .retry(3)
      .subscribe((res: Response) => {
        this.imageData = this.sanitizer.bypassSecurityTrustUrl(
          URL.createObjectURL(new Blob([res.arrayBuffer()], { type: 'image/jpeg' }))
        );
        this.bgImageAnimationState = 'show';
      });*/
    setTimeout(() => {
      this.bgImageAnimationState = 'show';
    }, 5000)
  }

  private load(): void {
    this.store.dispatch(this.categoryActions.reqCategories());
  }
}
