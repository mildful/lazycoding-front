/* tslint:disable: max-line-length */
import { Routes } from '@angular/router';

import { NotFound404Component } from './not-found404.component';

export const routes: Routes = [
  { path: '', redirectTo: '/posts', pathMatch: 'full' },
  { path: 'posts', loadChildren: './features/post/post.module#PostModule?sync=true' },
  { path: '**', component: NotFound404Component }
];
