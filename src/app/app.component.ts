import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Http, Response, ResponseContentType, Headers, RequestOptions } from '@angular/http';
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
import { TagActions } from './features/tag';
import { MOBILE } from './services/constants';

@Component({
  selector: 'lazy-app',
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
    private tagActions: TagActions,
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
    const headers: Headers = new Headers({ 'Content-Type': 'image/jpeg'});
    const options: RequestOptions = new RequestOptions({
      headers,
      responseType: ResponseContentType.Blob
    });
    this.http.get('https://unsplash.it/g/1920/1080/?random=true&blur=true', options)
      .take(1)
      .retry(3)
      .subscribe((res: Response) => {
        const blob: Blob = new Blob([res.blob()], { type: res.headers.get("Content-Type") });
        this.imageData = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob));
        this.bgImageAnimationState = 'show';
      });
  }

  private load(): void {
    this.store.dispatch(this.categoryActions.reqAllCategories());
    this.store.dispatch(this.tagActions.reqAllTags());
  }
}
