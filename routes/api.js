const router = require('express').Router();

const { checkToken, checkAdmin } = require('../utils/middlewares');

router.use('/asignaturas', require('./api/asignaturas'));
router.use('/usuarios', require('./api/usuarios'));
router.use('/profesores', require('./api/profesores'));
router.use('/alumnos', require('./api/alumnos'));
router.use('/administradores', checkToken, checkAdmin, require('./api/administradores'))
router.use('/clases', require('./api/clases'));

module.exports = router;