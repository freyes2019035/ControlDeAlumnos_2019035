const mongoose = require('mongoose');

let schema = mongoose.Schema;

let profesoresSchema = schema({
    nombre: String,
    rol: String,
    usuario: String,
    password: String,
    cursos: [{ type: mongoose.Schema.ObjectId, ref: 'cursos' }],
});

module.exports = mongoose.model('profesores', profesoresSchema)