const mongoose = require('mongoose');

let schema = mongoose.Schema;

let userSchema = schema({
    nombre: String,
    rol: String,
    usuario: String,
    password: String,
    cursos: [{ type: mongoose.Schema.ObjectId, ref: 'cursos' }],
});

module.exports = mongoose.model('user', userSchema)