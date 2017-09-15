import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule }    from '@angular/forms';
 
import { UserEditComponent } from './user-edit.component';
import { UserListComponent } from './user-list.component';
 
import { UserService } from './user.service';

import { UserRoutingModule } from './users-routing.module';
 
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    UserRoutingModule
  ],
  declarations: [
    UserEditComponent,
    UserListComponent
  ],
  providers: [ UserService ]
})
export class UsersModule {}