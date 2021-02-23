'use strict';
const cursoModel = require('../models/cursos.model');
const userModel = require('../models/user.model')
const ObjectID = require("mongodb").ObjectID;
exports.createCurso = (req, res) => {
    let curso = new cursoModel();
    const {nombre} = req.body;
    if(nombre && req.user.sub && req.user.rol == "ROL_MAESTRO"){
        curso.profesor = req.user.sub;
        curso.nombre = nombre;
        cursoModel.find({$or: [{nombre: curso.nombre}]},(err, doc) => {
            if(err){
                res.status(500).send({ status: "Error on get the curse" });
            }else if(doc && doc.length >= 1){
                res.status(200).send({ status: "User already exists in Data Base" });
            }else {
                curso.save((err, document) => {
                    if(err){
                      res.status(500).send({ status: "error on saving the user" });
                    }else{
                        res.status(200).send([{ status: "Curso saved" }, { curso: document }]);
                    }
                });
            }
        });
    }else{
        res.status(500).send({status: 'Missing some parameters'})
    }
}
exports.actualizarCurso = (req,res) => {
    const {id} = req.params;
    const {nombre} = req.body;
    if(nombre && req.user.sub && req.user.rol == "ROL_MAESTRO"){
       cursoModel.findById(id, (err, resp) => {
           if(err){
               res.status(500).send({status: 'error getting the curse'})
           }else if(resp.profesor == req.user.sub){
            // Edit Curse
            cursoModel.findByIdAndUpdate(id, {$set: {nombre: nombre}}, {new: true}, (err, document) => {
                if(err){
                    res.status(500).send({ status: "Warning !! Error on update course" });
                }else if(document){
                    res.status(200).send([{ status: "OK" }, { CursoUpdated: document }]);
                }else{
                    res.status(500).send([{ status: "Jmmmmm... We can't find that" }]);
                }
            });
           }else{
            res.status(500).send({status: 'You cant update courses that are not your courses'})
           }
       })
    }else{
        res.status(500).send({status: 'missing parammerts'})
    }
}
exports.eliminarCurso = async (req, res) => {
    const {id} = req.params;
    let defaultCurso = 0;
    await cursoModel.find({nombre: 'default'}, (err, resp) => {
        defaultCurso = resp[0]._id
    })
    userModel.find({cursos: id}, (err, res) => {
        if(err){console.log(err)}
        res.forEach(data => {
            if (data.rol === 'ROL_ALUMNO') {
                let pos = data.cursos.indexOf(id);
                data.cursos[pos] = defaultCurso;
                let newData = data.cursos;
                userModel.findByIdAndUpdate(data.id, { $set: { cursos: newData } }, (err, resp) => {
                    if (err) {
                        console.log(err);
                    }
                });
            }
        });
        
    })
    res.status(200).send([{status: 'records Updated'}])
}
exports.listarCursos = (req, res) => {
    cursoModel.find({profesor: req.user.sub},(err, docs) => {
        if(err){
            res.status(500).send('Error getting the curses')
        }else if(docs && docs.length >= 1){
            res.status(200).send(docs)
        }else{
            res.status(500).send('Some error ocurrs')
        }
    })
}

exports.createDefault = (req, res) => {
    let curso = new cursoModel();
    curso.nombre = "default"

    cursoModel.find({nombre: curso.nombre}, (err, resp) => {
        if(err){
            res.status(500).send(err);
        }else if(resp && resp.length >= 1){
            console.log({status: 'Default curse already exists'})
        }else{
            curso.save((err, resp) => {
                if(err){
                    console.log(err);
                }else{
                    console.log([{status: "Default Curse created"}, {resp}])
                }
            })
        }
    })
}