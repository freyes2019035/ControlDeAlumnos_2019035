const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller')
const md_auth = require('../middlewares/auth.middleware')
router.post('/', userController.createAlumno)
router.put('/:id', userController.updateAlumno)
router.delete('/:id', userController.deleteAlumno)
router.post('/curso', md_auth.ensureAuth, userController.asignCourse)
router.get('/curso', md_auth.ensureAuth, userController.getCourses)
module.exports = router;