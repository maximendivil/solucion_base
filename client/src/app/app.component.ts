import { Component, OnInit, OnChanges } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { User } from './models/user';
import { UserService } from './users/user.service'; 
import { GLOBAL } from './services/global';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [UserService]
})

export class AppComponent implements OnInit, OnChanges {
  public title = 'MUSIFY';
  public user: User;
  public user_register: User;
  public identity;
  public token;
  public errorMessage;
  public alertRegister;
  public url;
  public registerForm: FormGroup;

  constructor(
    private _userService: UserService,
    private _route: ActivatedRoute,
    private _router: Router
  ){
    this.user = new User('','','','','','ROLE_USER','');
    this.user_register = new User('','','','','','ROLE_USER','');    
    this.url = GLOBAL.url;
    this.errorMessage = '';
  }

  ngOnInit(){
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.registerForm = new FormGroup({
      'nombre': new FormControl(this.user.name, [
        Validators.required
      ]),
      'apellido': new FormControl(this.user.surname, Validators.required),
      'mail': new FormControl(this.user.email, Validators.required),
      'pass': new FormControl(this.user.password, Validators.required)
    });
  }

  ngOnChanges(){
    this.registerForm.reset();
  }

  get nombre() { return this.registerForm.get('nombre'); }

  get apellido() { return this.registerForm.get('apellido'); }

  get mail() { return this.registerForm.get('mail'); }

  get pass() { return this.registerForm.get('pass'); }

  public onSubmit(): void {
    //Conseguir los datos del usuario identificado
    this._userService.singup(this.user).subscribe(
      response => {
        let identity = response.user;
        this.identity = identity;

        if (!this.identity._id){
          alert("El usuario no esta correctamente identificado");
        }
        else {
          //Crear elemento en el localstorage para tener al usuario en sesión
          localStorage.setItem('identity', JSON.stringify(identity));
          //Conseguir el token para enviarselo a cada petición http.
          this._userService.singup(this.user, true).subscribe(
            response => {
              let token = response.token;
              this.token = token;
      
              if (this.token.length <= 0){
                alert("El token no se generó correctamente");
              }
              else {
                //Crear elemento en el localstorage para tener el token disponible
                localStorage.setItem('token', token);
                this.user = new User('','','','','','ROLE_USER','');
                this._router.navigate(['/users']);
              }
            },
            error => {
              var errorMessage = <any>error;
              if (errorMessage != null){
                var body = JSON.parse(error._body);
                this.errorMessage = body.message;
              }
            }
          );
        }
      },
      error => {
        var errorMessage = <any>error;
        if (errorMessage != null){
          var body = JSON.parse(error._body);
          this.errorMessage = body.message;
        }
      }
    );
  }

  public onSubmitRegister(): void {
    let userModel = this.registerForm.value;
    this.user_register.name = userModel.nombre;
    this.user_register.surname = userModel.apellido;
    this.user_register.email = userModel.email;
    this.user_register.password = userModel.password;

    this._userService.register(this.user_register).subscribe(
      response => {
        let user = response.user;
        this.user_register = user;

        if(!user._id){
          this.alertRegister = "Error al registrarse";
        }
        else {
          this.alertRegister = "Se registró al usuario correctamnete";
          this.user_register = new User('','','','','','ROLE_USER','');
          this.ngOnChanges();
        }
      },
      error => {
        var errorMessage = <any>error;
        if (errorMessage != null){
          var body = JSON.parse(error._body);
          this.alertRegister = body.message;
        }
      }
    );
  } 

  public logout(): void {
    localStorage.removeItem('identity');
    localStorage.removeItem('token');
    this.identity = null;
    this.token = null;
    this.errorMessage = '';
    this._router.navigate(['/']);
  }
}
