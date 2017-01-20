/* tslint:disable: max-line-length */
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

import { WindowRef } from '../../shared';

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

  constructor(private windowRef: WindowRef) {
    this.origin = encodeURIComponent(document.location.origin);
    this.title = encodeURIComponent(document.title);
    this.uri = encodeURIComponent(document.URL);
  }

  share(site: string): void {
    try {
      this.shareAPI();
    } catch (e) {
      console.warn(e.message);
      console.warn('Move to traditional redirection.');
      switch (site) {
        case 'facebook': this.facebook(); break;
        case 'facebook-like': this.facebookLike(); break;
        case 'google': this.google(); break;
        case 'linkedin': this.linkedin(); break;
        case 'twitter': this.twitter(); break;
        case 'link': this.link(); break;
        default: console.warn(`Sharing to '${site}' is not available.`);
      }
    }
  }

  private facebook(): void {
    this.windowRef.nativeWindow.open(`https://www.facebook.com/sharer/sharer.php?u=${this.uri}&t=${this.title}`);
  }

  private facebookLike(): void {
    this.windowRef.nativeWindow.open(`https://www.facebook.com/sharer/sharer.php?u=${this.uri}&t=${this.title}`);
  }

  private google(): void {
    this.windowRef.nativeWindow.open(`https://plus.google.com/share?url=${this.uri}&title=${this.title}`);
  }

  private link(): void {

  }

  private linkedin(): void {
    this.windowRef.nativeWindow.open(`http://www.linkedin.com/shareArticle?mini=true&url=${this.uri}&title=${this.title}&summary=${this.description}&source=${this.origin}`);
  }

  private shareAPI(): void {
    if (navigator['share'] !== undefined) {
      navigator['share']({
        title: this.title,
        text: this.description,
        url: this.uri
      }).then(() => console.log('Successful share'))
        .catch(error => console.log('Error sharing:', error));
    } else throw new Error('Share API is not available.');
  }

  private twitter(): void {
    this.windowRef.nativeWindow.open(`https://twitter.com/intent/tweet?source=${this.uri}&text=${this.title}:${this.uri}&via=mildful`);
  }
}
