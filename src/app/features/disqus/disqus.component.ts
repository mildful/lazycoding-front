import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';

declare var DISQUS: any;

@Component({
  selector: 'lazy-disqus',
  styleUrls: [ './disqus.component.css' ],
  template: `
    <div id="disqus_thread"></div>
  `
})
export class DisqusComponent implements OnChanges {

  @Input() identifier: string;
  @Input() url: string;

  ngOnChanges(changes: SimpleChanges): void {
    let pageIdentifier = (changes['identifier'] && changes['identifier'].currentValue)
      ? changes['identifier'].currentValue
      : this.identifier;
    let pageUrl = (changes['url'] && changes['url'].currentValue)
      ? changes['url'].currentValue
      : this.url;

    if (pageIdentifier || pageUrl) {
      console.log(DISQUS)
      DISQUS.reset({
        reload: true,
        config: function() {
          this.page.identifier = pageIdentifier;
          this.page.url = pageUrl;
        }
      });
    }
  }
}