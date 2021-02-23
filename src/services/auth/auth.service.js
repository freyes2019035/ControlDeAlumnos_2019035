'use strict'
const jwt = require('jwt-simple')
const moment = require('moment')
const secret = 'controlDeAlumnos_2019035'

exports.createToken = (user) => {
    let payload = {
        sub: user._id,
        name: user.nombre,
        usuario: user.usuario,
        rol: user.rol,
        cursos: user.cursos,
        iat: moment().unix(),
        exp: moment().day(10, 'days').unix()
    }
    return jwt.encode(payload, secret)
}

