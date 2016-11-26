import { Component, Input } from '@angular/core';

import { Post } from '../post-data';

@Component({
  selector: 'post-card',
  templateUrl: 'post-card.component.html',
  styleUrls: [ './post-card.style.css' ]
})
export class PostCardComponent {

  @Input() post: Post;
}
