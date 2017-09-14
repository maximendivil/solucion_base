import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UserService } from '../services/user.service';
import { UploadService } from '../services/upload.service';
import { SongService } from '../services/song.service';
import { GLOBAL } from '../services/global';
import { Artist } from '../models/artist';
import { Song } from '../models/song';

@Component({
    selector: 'song-edit',
    templateUrl: '../views/song-add.component.html',
    providers: [UserService, SongService, UploadService]
})
export class SongEditComponent implements OnInit {
    public titulo: string;
    public song: Song;
    public identity;
    public token;
    public url: string;
    public alertMessage: string;
    public filesToUpload: Array<File>;
    public is_edit: boolean;

    constructor(
        private _userService: UserService,
        private _songService: SongService,
        private _uploadService: UploadService,
        private _route: ActivatedRoute,
        private _router: Router
    ){
        this.titulo = "Editar canción";
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.song = new Song('',1,'','','');
        this.is_edit = true;
    }
    
    ngOnInit() {
        console.log("SongEditComponent cargado");
        this.getSong();
    }

    getSong(){
        this._route.params.forEach((params: Params) => {
            let id = params['id'];
            this._songService.getSong(this.token, id).subscribe(
                response => {
                    if (!response.song){
                        this._router.navigate(['/']);
                    }
                    else {
                        this.song = response.song;
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

    onSubmit(){        
        this._route.params.forEach((params: Params) => {
            let id = params['id'];

            this._songService.editSong(this.token, id, this.song).subscribe(
                response => {
                    if (!response.song){
                        alert("Error en el servidor");
                    }
                    else {
                        this.alertMessage = "La canción se ha creado correctamente";
                        this.alertMessage = "El album se ha creado correctamente";
                        console.log(this.filesToUpload)
                        if (!this.filesToUpload){
                            this._router.navigate(['/album', response.song.album]);
                        }
                        else {
                            //Subir la imagen
                            this._uploadService.makeFileRequest(this.url + 'upload-file-song/' + id, [], this.filesToUpload, this.token, 'file')
                            .then(
                                result => {
                                    this._router.navigate(['/album', response.song.album]);
                                },
                                error => {
                                    console.log(error);
                                }
                            );
                            //this._router.navigate(['/editar-artista', response.artist._id]);
                        }  
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

    fileChangeEvent(fileInput: any){
        this.filesToUpload =  <Array<File>> fileInput.target.files;
    }
}