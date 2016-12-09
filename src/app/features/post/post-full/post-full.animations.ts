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
      width: '142%',
      height: '142%'
    })),
    transition(':enter', [
      style({
        width: '20px',
        height: '20px'
      }),
      animate('400ms ease-in-out')
    ])
  ])
];