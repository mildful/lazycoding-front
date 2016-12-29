import {
  AnimationEntryMetadata,
  trigger,
  state,
  style,
  transition,
  animate } from '@angular/core';

export const ANIMATIONS: AnimationEntryMetadata[] = [
  trigger('bg', [
    state('in', style({ opacity: 1 })),
    transition(':enter', [
      style({ opacity: 0 }),
      animate(100)
    ]),
    transition(':leave', [
      animate(100, style({ opacity: 0 }))
    ])
  ])
];
