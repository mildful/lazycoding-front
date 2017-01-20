import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
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
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

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
export class AppComponent implements OnInit, OnDestroy {
  // utils
  showMonitor = (ENV === 'development' && !AOT &&
    ['monitor', 'both'].includes(STORE_DEV_TOOLS) // set in constants.js file in project root
  );
  contentWidth: string = this.showMonitor ? '70%' : '';
  mobile = MOBILE;
  // other
  bgImageAnimationState: string = 'hidden';
  imageData: any;
  isNavigationOpen$: Observable<boolean>;
  isShareVisible$: Observable<boolean>;
  routeIsPost$: Observable<boolean>;

  private destroyed$: Subject<void> = new Subject<void>();

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

  ngOnDestroy(): void {
    this.destroyed$.next();
  }

  ngOnInit(): void {
    this.loadBackground();
    this.isNavigationOpen$ = this.store.select((s: AppState) => s.navigation.isOpen).takeUntil(this.destroyed$);
    this.initShareBar();
  }

  private initShareBar(): void {
    this.routeIsPost$ = this.store.select((s: AppState) => s.router.path)
      .takeUntil(this.destroyed$)
      .map((path: string) => path.split('/').length > 2 && path.split('/')[1] === 'posts');
    this.isShareVisible$ = Observable.combineLatest(
      this.routeIsPost$,
      this.isNavigationOpen$,
      ((routeIsPost: boolean, navOpen: boolean) => routeIsPost && !navOpen)
    );
  }

  private load(): void {
    this.store.dispatch(this.categoryActions.reqAllCategories());
    this.store.dispatch(this.tagActions.reqAllTags());
  }

  private loadBackground(): void {
    const headers: Headers = new Headers({ 'Content-Type': 'image/jpeg'});
    const options: RequestOptions = new RequestOptions({
      headers,
      responseType: ResponseContentType.Blob
    });
    this.http.get('https://unsplash.it/g/1920/1080/?random=true&blur=true', options)
      .take(1)
      .retry(3)
      .subscribe((res: Response) => {
        const blob: Blob = new Blob([res.blob()], { type: res.headers.get('Content-Type') });
        this.imageData = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob));
        this.bgImageAnimationState = 'show';
      });
  }
}
