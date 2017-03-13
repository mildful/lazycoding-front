import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Angulartics2Module } from 'angulartics2';

import { SearchComponent } from './search.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    Angulartics2Module.forChild(),
  ],
  declarations: [ SearchComponent ],
  exports: [ SearchComponent ]
})
export class SearchModule { }
