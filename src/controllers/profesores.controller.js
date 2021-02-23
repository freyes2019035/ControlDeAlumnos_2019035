'use Strict';
const profesoresModel = require('../models/user.model');
const bcrypt = require('bcrypt-nodejs')
exports.createDefault = async (nombre, usuario, password) => {
    let profesores = new profesoresModel();
    if(nombre, usuario, password){
        profesores.nombre = nombre;
        profesores.usuario = usuario;
        profesores.password = await encryptPassword(password);
        profesores.rol = 'ROL_MAESTRO';

        profesoresModel.find({$or: [{usuario: profesores.usuario, rol: profesores.rol}]},(err, docsFound) => {
            if(err){
                console.log({ status: "Error on get the user" });
            }else if(docsFound && docsFound.length >= 1){
                console.log({ status: "User already exists in Data Base" });
            }else{
                profesores.save((err, doc) => {
                    if (err) {
                        console.log({ status: "error on saving the profesor" });
                      } else {
                        console.log([{ status: "profesor saved" }, { userInfo: doc }]);
                      }
                });
            }
        });
    }else{
        console.log({ status: "missing some parameters" });
    }
}
const encryptPassword = (password) => {
    return new Promise((resolve, reject) => {
      bcrypt.hash(password, null, null, (errors, passwordEncrypted) => {
        if (errors) {
          reject(new Error("Some error ocurrss encrypting the password"));
        } else {
          resolve(passwordEncrypted);
        }
      });
    });
};