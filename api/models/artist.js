'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ArtistSchema = Schema({
	name: String,
	description: String,
	image: String
});
//Exportamos el módulo
module.exports = mongoose.model('Artist', ArtistSchema);