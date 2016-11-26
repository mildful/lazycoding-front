import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';

import { UserEffects } from './user.effects';
import { UserService } from './user.service';
import { UserActions } from './user.actions';

@NgModule({
  exports: [ EffectsModule.run(UserEffects) ],
  providers: [
    UserService,
    UserActions
  ]
})
export class UserModule { }
