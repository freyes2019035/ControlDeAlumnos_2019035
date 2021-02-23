const express = require('express');
const router = express.Router();
const cursosController = require('../controllers/cursos.controllers')
const md_auth = require('../middlewares/auth.middleware')
router.get('/', md_auth.ensureAuth,cursosController.listarCursos)
router.post('/', md_auth.ensureAuth,cursosController.createCurso)
router.put('/:id', md_auth.ensureAuth,cursosController.actualizarCurso)
router.delete('/:id', md_auth.ensureAuth,cursosController.eliminarCurso)
router.get('/myCourses/PDF', md_auth.ensureAuth, cursosController.createPDF)
module.exports = router;