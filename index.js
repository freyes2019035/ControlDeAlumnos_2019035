'use strict'
const express = require("express");
const app = express();
const dbService = require("./src/services/db/db.service");
const port = 3000;
const morgan = require('morgan')
const bodyParser = require('body-parser')
const createProfessor = require('./src/controllers/profesores.controller')
const createCurseDefault = require('./src/controllers/cursos.controllers')
const cursosRoutes = require('./src/routes/cursos.routes')
const alumnosRoutes = require('./src/routes/user.routes');
const authRoutes = require('./src/routes/auth.routes')
// Start App
const startServer = (port) => {
    app.listen(port, () => {
      console.log(`App listening in port ${port}`);
    });
  };
// Body Parser
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
// MiddleWares
app.use(morgan('dev'))
//Routes
app.use('/cursos', cursosRoutes)
app.use('/alumnos', alumnosRoutes)
app.use('/login', authRoutes)
// Start DB
dbService
  .connectToDb()
  .then((resolved) => {
    if (resolved) {
      console.log(resolved);
      startServer(port);
      createProfessor.createDefault('Maestro','Maestro', 12345);
      createCurseDefault.createDefault();
    }
  })
  .catch((err) => {
    console.error(err);
  });

