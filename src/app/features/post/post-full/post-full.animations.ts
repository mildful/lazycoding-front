import {
  AnimationEntryMetadata,
  trigger,
  state,
  style,
  transition,
  animate } from '@angular/core';

export const ANIMATIONS: AnimationEntryMetadata[] = [
  trigger('circle', [
    state('in', style({
      width: '1350px',
      height: '1350px'
    })),
    transition(':enter', [
      style({
        width: '20px',
        height: '20px'
      }),
      animate('400ms ease-in-out')
    ])
  ]),

  trigger('cover', [
    state('in', style({
      transform: 'translateY(0)',
      opacity: 1
    })),
    transition(':enter', [
      style({
        transform: 'translateY(-50px)',
        opacity: 0
      }),
      animate('400ms 400ms ease-in-out')
    ])
  ]),

  trigger('content', [
    state('in', style({
      transform: 'translateY(0)',
      opacity: 1
    })),
    transition(':enter', [
      style({
        transform: 'translateY(50px)',
        opacity: 0
      }),
      animate('400ms 400ms ease-in-out')
    ])
  ]),

  trigger('category', [
    state('in', style({ transform: 'scaleX(1)' })),
    transition(':enter', [
      style({ transform: 'scaleX(0)' }),
      animate('400ms 400ms ease-in-out')
    ])
  ])
];