import { Component, Input } from '@angular/core';

@Component({
  selector: 'lazy-dot-content',
  template: `
    <span class="dot-content {{position}}"><ng-content></ng-content></span>
  `
})
export class DotContentComponent {
  @Input() position: string = 'right';
}
