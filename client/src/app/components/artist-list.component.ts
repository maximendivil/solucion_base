import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UserService } from '../services/user.service';
import { ArtistService } from '../services/artist.service';
import { GLOBAL } from '../services/global';
import { Artist } from '../models/artist';

@Component({
    selector: 'artist-list',
    templateUrl: '../views/artist-list.component.html',
    providers: [UserService, ArtistService]
})
export class ArtistListComponent implements OnInit {
    public titulo: string;
    public artists: Artist[];
    public identity;
    public token;
    public url: string;
    public nextPage;
    public prevPage;
    public confirmado;

    constructor(
        private _userService: UserService,
        private _artistService: ArtistService,
        private _route: ActivatedRoute,
        private _router: Router
    ){
        this.titulo = "Artistas";
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.nextPage = 1;
        this.prevPage = 1;
    }
    
    ngOnInit() {
        console.log("ArtistListComponent cargado");
        console.log(this.identity);
        console.log(this.token);
        //Conseguir el listado de artistas
        this.getArtists();
    }

    getArtists(){
        this._route.params.forEach((params: Params) => {
            let page = +params['page'];
            if (!page){
                page = 1;
            }
            else {
                this.nextPage = page + 1;
                this.prevPage = page - 1;

                if (this.prevPage == 0){
                    this.prevPage = 1;
                }
            }

            this._artistService.getArtists(this.token, page).subscribe(
                response => {
                    if (!response.artists){
                        this._router.navigate(['/']);
                    }
                    else {
                        this.artists = response.artists;
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
        });
    }

    onDeleteConfirm(id){
        this.confirmado = id;
    }

    onCancelArtist(){
        this.confirmado = null;
    }

    onDeleteArtist(id){
        this._artistService.deleteArtist(this.token, id).subscribe(
            response => {
                if (!response.artistRemoved){
                    alert('Error en el servidor');
                }
                else {
                    this.getArtists();
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
}