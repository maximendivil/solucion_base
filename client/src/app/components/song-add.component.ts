import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UserService } from '../services/user.service';
import { SongService } from '../services/song.service';
import { GLOBAL } from '../services/global';
import { Artist } from '../models/artist';
import { Song } from '../models/song';

@Component({
    selector: 'song-add',
    templateUrl: '../views/song-add.component.html',
    providers: [UserService, SongService]
})
export class SongAddComponent implements OnInit {
    public titulo: string;
    public song: Song;
    public identity;
    public token;
    public url: string;
    public alertMessage: string;

    constructor(
        private _userService: UserService,
        private _songService: SongService,
        private _route: ActivatedRoute,
        private _router: Router
    ){
        this.titulo = "Crear nueva canción";
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.song = new Song('',1,'','','');
    }
    
    ngOnInit() {
        console.log("SongAddComponent cargado");
        //Conseguir el listado de artistas
    }

    onSubmit(){        
        this._route.params.forEach((params: Params) => {
            let albumId = params['album'];
            this.song.album = albumId;
            console.log(this.song);
            this._songService.addSong(this.token, this.song).subscribe(
                response => {
                    if (!response.song){
                        alert("Error en el servidor");
                    }
                    else {
                        this.song = response.song;
                        this.alertMessage = "La canción se ha creado correctamente";
                        this._router.navigate(['/editar-cancion', response.song._id]);
                    }
                },
                error => {
                    var errorMessage = <any>error;
                    if (errorMessage != null){
                      var body = JSON.parse(error._body);
                      this.alertMessage = body.message;
                      console.log(errorMessage);
                    }
                }
            );
        });
    }
}