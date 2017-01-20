import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'lazy-share',
  templateUrl: 'share.component.html',
  styleUrls: [ './share.component.css' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShareComponent {

  @Input() description: string = '';
  @Input() isVisible: boolean = false;
  @Input() url: string = null;
  private origin: string;
  private title: string;
  private uri: string;

  constructor() {
    this.origin = encodeURIComponent(document.location.origin);
    this.title = encodeURIComponent(document.title);
    this.uri = encodeURIComponent(document.URL);
  }

  facebook(): void {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${this.uri}&t=${this.title}`);
  }

  facebookLike(): void {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${this.uri}&t=${this.title}`);
  }

  google(): void {
    window.open(`https://plus.google.com/share?url=${this.uri}&title=${this.title}`);
  }

  linkedin(): void {
    window.open(`http://www.linkedin.com/shareArticle?mini=true&url=${this.uri}&title=${this.title}&summary=${this.description}&source=${this.origin}`);
  }

  twitter(): void {
    window.open(`https://twitter.com/intent/tweet?source=${this.uri}&text=${this.title}:${this.uri}&via=mildful`);
  }

  link(): void {

  }
}
