import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UserService } from '../services/user.service';
import { ArtistService } from '../services/artist.service';
import { AlbumService } from '../services/album.service';
import { GLOBAL } from '../services/global';
import { Artist } from '../models/artist';
import { Album } from '../models/album';

@Component({
    selector: 'artist-detail',
    templateUrl: '../views/artist-detail.component.html',
    providers: [UserService, ArtistService, AlbumService]
})
export class ArtistDetailComponent implements OnInit {
    public titulo: string;
    public alertMessage: string;
    public artist: Artist;
    public identity;
    public token;
    public url: string;
    public nextPage;
    public prevPage;
    public albums: Array<Album>;
    public confirmado: string;

    constructor(
        private _userService: UserService,
        private _artistService: ArtistService,
        private _albumService: AlbumService,
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
        this.getArtist();
    }

    getArtist(){
        this._route.params.forEach((params: Params) => {
            let id = params['id'];
            this._artistService.getArtist(this.token, id).subscribe(
                response => {
                    if (!response.artist){
                        this._router.navigate(['/']);
                    }
                    else {
                        this.artist = response.artist;

                        //Sacar los albums del artista
                        this._albumService.getAlbums(this.token, response.artist._id).subscribe(
                            response => {
                                if (!response.albums){
                                    this.alertMessage = "El artista no posee albums";
                                }
                                else {
                                    this.albums = response.albums;
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

    onCancelAlbum(){
        this.confirmado = null;
    }

    onDeleteAlbum(id){
        this._albumService.deleteAlbum(this.token, id).subscribe(
            response => {
                console.log(response)
                if (!response.albumRemoved){
                    console.log("Error en el servidor")
                }
                else {
                    this.getArtist();
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