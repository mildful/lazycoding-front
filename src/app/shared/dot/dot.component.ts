import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'lc-dot',
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="dot" [class.selected]="selected">
      <div class="wrapper {{wrapperClasses}}">
        <img src="{{img}}" alt="{{alt}}">
      </div>
      <ng-content></ng-content>
    </div>
  `,
  styleUrls: [ './dot.component.css' ]
})
export class DotComponent {
  @Input() img: string;
  @Input() alt: string;
  @Input() wrapperClasses: string;
  @Input() selected: boolean;
}
