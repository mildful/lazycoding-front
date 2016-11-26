import { Component, Input } from '@angular/core';

@Component({
  selector: 'lc-dot-content',
  template: `
    <span class="content {{position}}"><ng-content></ng-content></span>
  `
})
export class DotContentComponent {
  @Input() position: string = 'right';
}
