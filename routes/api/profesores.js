const { update: updateProfesor, getProfesorByUsuarioId } = require('../../models/profesor.model');
const { getAsiganturasByProfesorId, updateClase, getByAsignaturaAndProfesorId, create: createAsignaturaByProfesorId, deleteByAsignaturaAndProfesorId } = require('../../models/profesor_asignatura.model');
const { update: updateUsuario, getById: getByUsuarioId } = require('../../models/usuario.model');
const { getAlumnosByProfesorID } = require('../../models/usuario.model');
const { deleteByAlumno } = require('../../models/clase.model');
const { getCoordenadas, getProfesorAndClases } = require('../../utils/helpers');
const { deleteByPrAs } = require('../../models/clase.model');

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
        const profesor = await getProfesorAndClases(req.usuario);
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
        const [usuario] = await getByUsuarioId(usuarioId);
        const profesor = await getProfesorAndClases(usuario[0]);
        res.json(profesor);
    } catch (error) {
        res.status(503).json({ Error: error.message });
    }
});

router.patch('/clases/:asignaturaId', async (req, res) => { //crear una clase para la asignatura
    const { asignaturaId } = req.params;
    const usuarioId = req.usuario.id;

    try {
        await updateClase(usuarioId, asignaturaId, req.body)
        const profesor = await getProfesorAndClases(req.usuario);
        res.json(profesor);
    } catch (error) {
        res.status(503).json({ Error: error.message });
    }
});

router.post('/asignaturas/:asignaturaId', async (req, res) => {//Crear nueva asignatura para ese profesor ¿COMPROBAR DUPLICADOS?
    const { asignaturaId } = req.params;
    const usuarioId = req.usuario.id;

    try {
        await createAsignaturaByProfesorId(usuarioId, asignaturaId);
        const profesor = await getProfesorAndClases(req.usuario);
        res.json(profesor);
    } catch (error) {
        res.stauts(503).json({ Error: error.message });
    }
});

router.delete('/alumnos/:alumnoId', async (req, res) => {//Finalizar clase para un alumno TERMINAR
    const { alumnoId } = req.params;
    const usuarioId = req.usuario.id;
    const { asignatura_id } = req.body;
    try {
        const [result] = await deleteByAlumno(usuarioId, asignatura_id, alumnoId);
        //obtener clase del alumno getByAlumno
        res.json(result);
    } catch (error) {
        res.status(503).json({ Error: error.message });
    }

});

router.delete('/clases/:asignaturaId', async (req, res) => {//finalizar clase de profesor y asignatura y para todos los alumnos TERMINAR ALUMNOS
    const { asignaturaId } = req.params;
    const usuarioId = req.usuario.id;

    try {
        await updateClase(usuarioId, asignaturaId, req.body)
        const [result] = await getByAsignaturaAndProfesorId(usuarioId, asignaturaId);//obtenemos la clase
        //const [alumnos] = await deleteByPrAs(usuarioId, asignaturaId); //comprobar
        const profesor = await getProfesorAndClases(req.usuario);
        //profesor.alumnos = alumnos;
        res.json(profesor);

    } catch (error) {
        res.status(503).json({ Error: error.message });
    }

});

router.delete('/asignaturas/:asignaturaId', async (req, res) => {//Eliminar asignatura a profesor TERMINAR FINALIZAR ALUMNOS
    const { asignaturaId } = req.params;
    const usuarioId = req.usuario.id;

    try {
        const [result] = await getByAsignaturaAndProfesorId(usuarioId, asignaturaId);//obtenemos la clase

        if (result.length === 0) {
            return res.json('Error: El profesor no tiene esta asignatura')
        }

        await deleteByAsignaturaAndProfesorId(usuarioId, asignaturaId);
        const profesor = await getProfesorAndClases(req.usuario);
        if (asignatura.clase === 1) { //Si hay alumnos en esa clase se finaliza
            const [alumnos] = await deleteByPrAs(usuarioId, asignaturaId); //comprobar
        }
        res.json(profesor);

    } catch (error) {
        res.status(503).json({ Error: error.message });
    }
})

module.exports = router;