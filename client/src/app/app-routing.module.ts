import { NgModule }              from '@angular/core';
import { RouterModule, Routes }  from '@angular/router';
 
const appRoutes: Routes = [
    //{ path: '**', component: ArtistListComponent }    
];
 
@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes
    )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}