'use strict'

var fs = require('fs');
var path = require('path');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');
var User = require('../models/user');

function saveUser(req, res){
	var params = req.body;
	var user = new User();

	user.name = params.name;
	user.surname = params.surname;
	user.email = params.email;
	user.role = 'ROLE_USER';
	user.image = 'null';

	if (params.password){
		//Encriptación de la contraseña
		bcrypt.hash(params.password, null, null, function(err, hash){
			user.password = hash;

			if (user.name != null && user.surname != null && user.email != null){
				//Guardar los datos
				user.save((err, userStored) => {
					if (err){
						res.status(500).send({
							'message': 'Oucurrió un error al guardar el usuario'
						});
					}
					else {
						if (!userStored){
							res.status(404).send({
								'message': 'No se ha registrado el usuario'
							});
						}
						else {
							res.status(200).send({
							'user': userStored
						});
						}
					}
				});
			}
			else {
				res.status(200).send({
					'message': 'Completar los campos obligatorios'
				});
			}
		});
	}
	else {
		res.status(200).send({
			'message': 'Introduce la contraseña'
		});
	}
}

function loginUser(req, res){
	var params = req.body;
	var email = params.email;
	var password = params.password;

	User.findOne({ email: email.toLowerCase() }, (err, user) => {
		if (err){
			res.status(500).send({
				message: 'Ocurrió un error al realizar la petición del usuario'
			});
		}
		else {
			if (!user){
				res.status(404).send({
					message: 'El usuario no existe'
				});
			}
			else {
				//Comparar las contraseñas
				bcrypt.compare(password, user.password, function(err, check){
					if (check){
						if (params.gethash){
							//Se crea un token de identificación que se utilizará en las siguientes peticiones
							res.status(200).send({token: jwt.createToken(user)});
						}
						else {
							res.status(200).send({user});
						}
					}
					else {
						res.status(404).send({
							message: 'El usuario no ha podido loguearse'
						});
					}
				});
			}
		}
	}); 
}

function updateUser(req, res){
	var userId = req.params.id;
	var update = req.body;

	//Se controla que el id de la URL sea el mismo que el id guardado en el token
	if (userId != req.user.sub){
		res.status(500).send({message: 'No tienes permisos para actualizar este usuario'})
	}

	User.findByIdAndUpdate(userId, update, (err, userUpdated) => {
		if (err){
			res.status(500).send({message: 'Ocurrió un error al actualizar el usuario'})
		}
		else {
			if (!userUpdated){
				res.status(404).send({message: 'El usuario no ha podido actualizarse'});
			}
			else {
				res.status(200).send({user: userUpdated});
			}
		}
	});
}

function uploadImage(req, res){
	var userId = req.params.id;
	var file_name = 'No subido...';

	if (req.files){
		var file_path = req.files.image.path;
		var file_split = file_path.split('\\');
		var file_name = file_split[2];

		var ext_split = file_name.split('\.');
		var file_ext = ext_split[1];

		if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif'){
			User.findByIdAndUpdate(userId, {image: file_name}, (err, userUpdated) => {
				if (!userUpdated){
					res.status(404).send({message: 'El usuario no ha podido actualizarse'});
				}
				else {
					res.status(200).send({image: file_name, user: userUpdated});
				}
			});
		}
		else {
			res.status(200).send({message: 'Extensión del archivo no válida'});
		}
		console.log(file_path);
	}
	else {
		res.status(200).send({message: 'No has subido ninguna imagen'});
	}
}

function getImageFile(req, res){
	var imageFile = req.params.imageFile;
	var path_file = './uploads/users/' + imageFile;
	fs.exists(path_file, function(exists){
		if (exists){
			res.sendFile(path.resolve(path_file));
		}
		else {
			res.status(200).send({message: 'La imagen no existe'});
		}
	});
}

module.exports = {
	saveUser,
	loginUser,
	updateUser,
	uploadImage,
	getImageFile
};