const router = require('express').Router();

const { checkToken, checkAdmin, checkProfe, checkAlum } = require('../utils/middlewares');

router.use('/publica', require('./api/publica'));
router.use('/usuarios', require('./api/usuarios'));
router.use('/asignaturas', require('./api/asignaturas'));
router.use('/profesores', checkToken, checkProfe, require('./api/profesores'));
router.use('/alumnos', checkToken, checkAlum, require('./api/alumnos'));
router.use('/administradores', checkToken, checkAdmin, require('./api/administradores'))
router.use('/clases', checkToken, checkAlum, require('./api/clases'));

module.exports = router;