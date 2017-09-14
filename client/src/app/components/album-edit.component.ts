import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UserService } from '../services/user.service';
import { UploadService } from '../services/upload.service';
import { AlbumService } from '../services/album.service';
import { GLOBAL } from '../services/global';
import { Artist } from '../models/artist';
import { Album } from '../models/album';

@Component({
    selector: 'album-edit',
    templateUrl: '../views/album-add.component.html',
    providers: [UserService, AlbumService, UploadService]
})
export class AlbumEditComponent implements OnInit {
    public titulo: string;
    public album: Album;
    public identity;
    public token;
    public url: string;
    public alertMessage: string;
    public filesToUpload: Array<File>;
    public is_edit: boolean;

    constructor(
        private _userService: UserService,
        private _uploadService: UploadService,
        private _albumService: AlbumService,
        private _route: ActivatedRoute,
        private _router: Router
    ){
        this.titulo = "Editar album";
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.album = new Album('','',2017, '', '');
        this.is_edit = true;
    }

    ngOnInit(){
        console.log('album-add.component cargado');
        this.getAlbum();
    }

    getAlbum(){
        this._route.params.forEach((params: Params) => {
            let id = params['id'];
            this._albumService.getAlbum(this.token, id).subscribe(
                response => {
                    if (!response.album){
                        this._router.navigate(['/']);
                    }
                    else {
                        this.album = response.album;
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

            this._albumService.editAlbum(this.token, id, this.album).subscribe(
                response => {
                    if (!response.album){
                        alert("Error en el servidor");
                    }
                    else {
                        this.alertMessage = "El album se ha creado correctamente";
                        if (!this.filesToUpload){

                        }
                        else {
                            //Subir la imagen
                            this._uploadService.makeFileRequest(this.url + 'upload-image-album/' + id, [], this.filesToUpload, this.token, 'image')
                            .then(
                                result => {
                                    this._router.navigate(['/artista', response.album.artist]);
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
            )
        });        
    }

    fileChangeEvent(fileInput: any){
        this.filesToUpload =  <Array<File>> fileInput.target.files;
    }
}