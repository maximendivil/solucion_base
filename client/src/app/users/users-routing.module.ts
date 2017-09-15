import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
 
import { UserListComponent }    from './user-list.component';
import { UserEditComponent }  from './user-edit.component';
 
const usersRoutes: Routes = [
    { path: '', component: UserListComponent },
    { path: 'users', component: UserListComponent },
    { path: 'mis-datos', component: UserEditComponent }
];
 
@NgModule({
  imports: [
    RouterModule.forChild(usersRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class UserRoutingModule { }