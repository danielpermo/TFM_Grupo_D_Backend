const { update: updateProfesor, getProfesorByUsuarioId } = require('../../models/profesor.model');
const { getAsiganturasByProfesorId } = require('../../models/profesor_asignatura.model');
const { update: updateUsuario, getById: getByUsuarioId } = require('../../models/usuario.model');
const { getAlumnosByProfesorID } = require('../../models/usuario.model');
const { addProfesorAUsuario, getCoordenadas } = require('../../utils/helpers');

const router = require('express').Router();

router.get('/alumnos/', async (req, res) => {
    const profesorID = req.usuario.id;

    try {
        const [result] = await getAlumnosByProfesorID(profesorID);

        if (result.length === 0) {
            return res.json('No hay alumnos disponibles');
        }

        res.json(result);
    } catch (error) {
        res.status(503).json({ Error: error.message });
    }
})

router.get('/perfil', async (req, res) => {

    try {
        const profesor = await addProfesorAUsuario(req.usuario);
        const [asignaturas] = await getAsiganturasByProfesorId(req.usuario.id);
        profesor.asignaturas = asignaturas;
        delete profesor.password;
        res.json(profesor);
    } catch (error) {
        res.status(503).json({ Error: error.message });
    }
});

router.put('/', async (req, res) => {//modificar datos profesor
    const usuarioId = req.usuario.id;

    try {
        if (req.usuario.direccion !== req.body.direccion || req.usuario.ciudad !== req.body.direccion) {
            const ubicacion = await getCoordenadas(req.body.direccion, req.body.ciudad);
            req.body.latitud = (ubicacion) ? ubicacion.latitude : 0;//solo añadimos latitud y longitud si nos devuelve el dato, si no se rellena 0
            req.body.longitud = (ubicacion) ? ubicacion.longitude : 0;
        }

        await updateUsuario(usuarioId, req.body);
        await updateProfesor(usuarioId, req.body);
        const [profesor] = await getProfesorByUsuarioId(usuarioId);
        res.json(profesor[0]);
    } catch (error) {
        res.status(503).json({ Error: error.message });
    }
});

router.patch('/clases/:asignaturaId', (req, res) => {
    //crear una clase para la asignatura
});

router.post('/asignaturas/:asignaturaId', (req, res) => {
    //Crear nueva asignatura para ese profesor
});

router.delete('/alumnos/:alumnoId', (req, res) => {
    //Finalizar clase para un alumnos
});

router.delete('/clases/:asignaturaId', (req, res) => {
    //finalizar clase de profesor y asignatura y para todos los alumnos
});

router.delete('/asignaturas/::asignaturaId', (req, res) => {
    //Eliminar asignatura a profesor
})

module.exports = router;