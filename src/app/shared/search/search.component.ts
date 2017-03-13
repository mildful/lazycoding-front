import { Component, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'lc-search',
  templateUrl: 'search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, OnDestroy {

  isOpen: boolean = false;
  searchStr: string = null;
  @Output('onSearch') onSearch: EventEmitter<string> = new EventEmitter<string>();
  private destroyed$: Subject<any> = new Subject<any>();

  closeSearch(): void {
    this.searchStr = null;
    this.isOpen = false;
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
  }

  ngOnInit(): void {
    const pressEscape$: Observable<KeyboardEvent> = Observable.fromEvent(window, 'keydown')
      .takeUntil(this.destroyed$)
      .throttleTime(500)
      .filter((e: KeyboardEvent) => this.isOpen && e.keyCode === 27);
    const pressCtrl$: Observable<KeyboardEvent> = Observable.fromEvent(window, 'keydown')
      .takeUntil(this.destroyed$)
      .throttleTime(200)
      .filter((e: KeyboardEvent) => !this.isOpen && e.keyCode === 17);
    const releaseCtrl$: Observable<KeyboardEvent> = Observable.fromEvent(window, 'keyup')
      .takeUntil(this.destroyed$)
      .throttleTime(200)
      .filter((e: KeyboardEvent) => !this.isOpen && e.keyCode === 17);
    const pressI$: Observable<KeyboardEvent> = Observable.fromEvent(window, 'keydown')
      .takeUntil(this.destroyed$)
      .throttleTime(200)
      .filter((e: KeyboardEvent) => !this.isOpen && e.keyCode === 73);

    pressEscape$.subscribe(() => this.closeSearch());
    let ctrlDown: boolean = false;
    pressCtrl$.subscribe(() => ctrlDown = true);
    releaseCtrl$.subscribe(() => ctrlDown = false);
    pressI$.subscribe((e: KeyboardEvent) => {
      if (ctrlDown) {
        e.preventDefault();
        this.openSearch();
      }
    });
  }

  openSearch(): void {
    this.isOpen = true;
  }

  onSubmit(e: Event): void {
    e.preventDefault();
    this.onSearch.emit(this.searchStr);
    this.closeSearch();
  }
}