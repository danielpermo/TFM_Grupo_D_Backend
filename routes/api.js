const router = require('express').Router();


router.use('/asignaturas', require('./api/asignaturas'));
router.use('/usuarios', require('./api/usuarios'));
router.use('/profesores', require('./api/profesores'));
router.use('/alumnos', require('./api/alumnos'));
router.use('/administradores', require('./api/administradores'))
router.use('/clases', require('./api/clases'));


module.exports = router;