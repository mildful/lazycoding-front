import { Component } from '@angular/core';

@Component({
  selector: 'lc-search',
  templateUrl: 'search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {

  isOpen: boolean = false;

  closeSearch(): void {
    this.isOpen = false;
  }

  openSearch(): void {
    this.isOpen = true;
  }

  onSubmit(e: Event, searchStr: string): void {
    e.preventDefault();

    console.log(searchStr)
  }
}