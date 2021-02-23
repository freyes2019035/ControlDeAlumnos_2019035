const mongoose = require('mongoose');
let schema = mongoose.Schema;

let cursosSchema = schema({
    nombre: String,
    profesor: {type: mongoose.Schema.ObjectId, ref: 'users'}
});
module.exports = mongoose.model('cursos', cursosSchema)