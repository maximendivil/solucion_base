import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UserService } from '../services/user.service';
import { AlbumService } from '../services/album.service';
import { SongService } from '../services/song.service';
import { GLOBAL } from '../services/global';
import { Artist } from '../models/artist';
import { Album } from '../models/album';
import { Song } from '../models/song';

@Component({
    selector: 'album-detail',
    templateUrl: '../views/album-detail.component.html',
    providers: [UserService, AlbumService, SongService]
})
export class AlbumDetailComponent implements OnInit {
    public titulo: string;
    public alertMessage: string;
    public album: Album;
    public identity;
    public token;
    public url: string;
    public nextPage;
    public prevPage;
    public albums: Array<Album>;
    public confirmado: string;
    public songs: Array<Song>;

    constructor(
        private _userService: UserService,
        private _albumService: AlbumService,
        private _songService: SongService,
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
        console.log("album-detail.component cargado");
        console.log(this.identity);
        console.log(this.token);
        this.getAlbum();
    }

    getAlbum(){
        this._route.params.forEach((params: Params) => {
            let id = params['id'];
            console.log(id);
            this._albumService.getAlbum(this.token, id).subscribe(
                response => {
                    if (!response.album){
                        this._router.navigate(['/']);
                    }
                    else {
                        this.album = response.album;
                        console.log(response);
                        //Sacar las canciones del artista
                        this._songService.getSongs(this.token, response.album._id).subscribe(
                            response => {
                                if (!response.songs){
                                    this.alertMessage = "El artista no posee canciones";
                                }
                                else {
                                    console.log(response.songs);
                                    this.songs = response.songs;
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

    onCancelSong(){
        this.confirmado = null;
    }

    onDeleteSong(id){
        this._songService.deleteSong(this.token, id).subscribe(
            response => {
                if (!response.songRemoved){
                    this.alertMessage = "El artista no posee canciones";
                }
                else {
                    console.log(response.songs);
                    this.getAlbum();
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

    startPlayer(song){
        let song_player = JSON.stringify(song);
        let file_path = this.url + 'get-file-song/' + song.file;
        let image_path = this.url + 'get-image-album/' + song.album.image;

        localStorage.setItem('sound_song', song_player);
        document.getElementById('mp3-source').setAttribute('src', file_path);
        (document.getElementById('player') as any).load();
        (document.getElementById('player') as any).play();
        document.getElementById('play-song-title').innerHTML = song.name;
        document.getElementById('play-song-artist').innerHTML = song.album.artist.name;
        document.getElementById('play-image-album').setAttribute('src', image_path);
    }
}