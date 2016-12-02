import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PostListComponent } from './post-list/post-list.component';
import { PostFullComponent } from './post-full/post-full.component';

const routes: Routes = [
  { path: '', component: PostListComponent },
  { path: ':slug', component: PostFullComponent },
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ],
})
export class PostRoutingModule { }

export const routedComponents = [ PostListComponent, PostFullComponent ];
