import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UserService } from '../services/user.service';
import { GLOBAL } from '../services/global';
import { User } from '../models/user';

@Component({
    selector: 'user-list',
    templateUrl: '../views/user-list.component.html',
    providers: [UserService]
})
export class UserListComponent implements OnInit {
    public titulo: string;
    public users: User[];
    public identity;
    public token;
    public url: string;
    public confirmado;

    constructor(
        private _userService: UserService,
        private _route: ActivatedRoute,
        private _router: Router
    ){
        this.titulo = "Usuarios";
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
    }
    
    ngOnInit() {
        console.log("UserListComponent cargado");
        if (this.identity){
            //Conseguir el listado de usuarios
            this.getUsers();
        }
        else {
            this._router.navigate(['/']);
        }
    }

    getUsers(){
        this._userService.getUsers(this.token).subscribe(
            response => {
                if (!response.users){
                    console.log("No hay usuarios");
                    //this._router.navigate(['/']);
                }
                else {
                    this.users = response.users;
                }
            },
            error => {
                var errorMessage = <any>error;
                if (errorMessage != null){
                    var body = JSON.parse(error._body);
                    console.log(errorMessage);
                }
            }
        );
    }

    onDeleteConfirm(id){
        this.confirmado = id;
    }

    onCancelArtist(){
        this.confirmado = null;
    }
}