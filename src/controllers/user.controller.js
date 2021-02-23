const modelUsuario = require('../models/user.model')
const bcrypt = require('bcrypt-nodejs')
exports.createAlumno = async (req, res) => {
    let alumno = new modelUsuario();
    const {nombre, usuario, password} = req.body;
    if(nombre, usuario, password){
        alumno.nombre = nombre;
        alumno.usuario = usuario;
        alumno.password = await encryptPassword(password);
        alumno.rol = "ROL_ALUMNO";
        alumno.cursos = [];

        modelUsuario.find({usuario: alumno.usuario, rol: alumno.rol, nombre: alumno.nombre}, (err, alumnoFind) => {
            if(err){
                res.status(500).send({status: 'Error getting alumno'})
            }else if(alumnoFind && alumnoFind.length >=1){
                res.status(500).send({ status: "Studeny already exists in DB" });
            }else{
                alumno.save((err, student) => {
                    if(err){
                        res.status(500).send({status: 'Error saving alumno'})
                    }else{
                        res.status(200).send({Student: student})
                    }
                })
            }
        })
    }else{
        res.status(500).send({status: 'Missing Parameters'})
    }
}
exports.updateAlumno = async (req, res) => {
    let alumno = new modelUsuario();
    const { id } = req.params;
    const {nombre, usuario, password } = req.body;
    if(nombre, usuario, password){
        alumno.nombre = nombre;
        alumno.usuario = usuario;
        alumno.password = await encryptPassword(password)
        modelUsuario.findByIdAndUpdate(id, {$set: {nombre: alumno.nombre, usuario: alumno.usuario, password: alumno.password}}, {new: true}, (err, docs) => {
            if(err){
                res.status(500).send({status: 'error updating alumno'})
            }else{
                res.status(200).send([{ status: "OK" }, { alumnoUpdated: docs }]);
            }
        })
    }else{
        res.status(500).send({status: 'Missing Parameters'})
    }
}
exports.deleteAlumno = async (req, res) => {
    const { id } = req.params;
    await modelUsuario.findByIdAndRemove(id,(err, resp) => {
        if(err){
            res.status(500).send({status: "error removing alumno"})
        }else{
            res.status(200).send([{ status: "OK" }, { deleted: resp }]);
        }
    })
}
exports.asignCourse = async (req, res) => {
    const id = req.user.sub
    const {curso} = req.body;
    modelUsuario.findById(id, (err, userFound) => {
        if(err){
            res.status(500).send({status: 'Error getting the user'})
        }else{
            if(userFound.cursos.length >= 3){
                res.status(500).send({status: "You already have 3 courses, MAX 3 COURSES"})
            }else if(userFound.cursos.find(element => element == curso)){
                res.status(500).send({status: "You already have that course"})
            }else{
                modelUsuario.findByIdAndUpdate(id, {
                    $push: {cursos: curso}
                },{new: true}, (err, resp) => {
                    if(err){
                        console.log(err)
                        res.status(500).send('Error adding course')
                    }else{
                        res.status(200).send([{ status: "OK" }, { cursoAdded: resp }]);
                    }
                })
            }
        }
    });

}
exports.getCourses = async (req, res) => {
    const id = req.user.sub;
    modelUsuario.findById(id).populate('cursos').exec((err, resp) => {
        if(err){
            res.status(500).send({status: 'error in get the cursos'})
        }else{
            res.status(200).send(resp.cursos)
        }
    });
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