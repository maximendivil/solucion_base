import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map' ;
import { Observable } from 'rxjs/observable';
import { GLOBAL } from './global';
import { Album } from '../models/album';
import { Song } from '../models/song';

@Injectable()
export class SongService {
    public url: string;
    
    constructor(private _http: Http){
        this.url = GLOBAL.url;
    }

    addSong(token, song: Song){
        let params = JSON.stringify(song);
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });
        return this._http.post(this.url + 'song', params, {headers: headers}).map(res => res.json());
    }

    getSong(token, id: string){
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        let options = new RequestOptions({headers: headers});
        return this._http.get(this.url + 'song/' + id, options).map(res => res.json());
    }

    editSong(token, idSong, song: Song){
        let params = JSON.stringify(song);
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });
        return this._http.put(this.url + 'song/' + idSong, params, {headers: headers}).map(res => res.json());
    }    

    getSongs(token, albumId = null) {
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        console.log("Album:" + albumId);

        let options = new RequestOptions({headers: headers});

        if (albumId == null){
            return this._http.get(this.url + 'songs', options).map(res => res.json());
        }
        else {
            return this._http.get(this.url + 'songs/' + albumId, options).map(res => res.json());
        }
    }

    deleteSong(token, id: string){
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        let options = new RequestOptions({headers: headers});
        return this._http.delete(this.url + 'song/' + id, options).map(res => res.json());
    }
}