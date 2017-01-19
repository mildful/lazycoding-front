import {
  AnimationEntryMetadata,
  trigger,
  state,
  style,
  transition,
  animate } from '@angular/core';

export const ANIMATIONS: AnimationEntryMetadata[] = [
  trigger('slideUp', [
    state('in', style({ transform: 'translateY(0)' })),
    transition(':enter', [
      style({ transform: 'translateY(100%)' }),
      animate(250)
    ]),
    transition(':leave', [
      animate(250, style({ transform: 'translateY(100%)' }))
    ])
  ])
];
