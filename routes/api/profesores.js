const router = require('express').Router();

const { update: updateProfesor } = require('../../models/profesor.model');
const { updateClase, getByAsignaturaAndProfesorId, create: createAsignaturaByProfesorId, deleteByAsignaturaAndProfesorId, getClasesActivasByProfesorId } = require('../../models/profesor_asignatura.model');
const { update: updateUsuario, getById: getByUsuarioId, deleteById: deleteByUsuarioId } = require('../../models/usuario.model');
const { deleteByAlumno } = require('../../models/clase.model');
const { getCoordenadas, getProfesorAndClases, getAlumnosWhithClasesByProfesorId } = require('../../utils/helpers');
const { deleteByPrAs } = require('../../models/clase.model');

router.get('/alumnos/', async (req, res) => {
    const usuarioId = req.usuario.id;

    try {
        const alumnos = await getAlumnosWhithClasesByProfesorId(usuarioId);
        res.json(alumnos);
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
            req.body.latitud = (ubicacion) ? ubicacion.latitude : 0;//solo añadimos latitud y longitud si devuelve el dato, si no se rellena 0
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

router.post('/asignaturas/:asignaturaId', async (req, res) => {//Crear nueva asignatura para ese profesor 
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

router.delete('/perfil', async (req, res) => {
    const usuarioId = req.usuario.id;

    try {
        await deleteByUsuarioId(usuarioId, req.body);
        const [result] = await getClasesActivasByProfesorId(usuarioId);

        if (result.length > 0) {
            //finalizar todas las clases para todos los alumnos, por id_profesor
        }
        delete req.usuario.password;
        req.usuario.borrado = 1;
        res.json(req.usuario);
    } catch (error) {
        res.status(503).json({ Error: error.message })
    }
}),

    router.delete('/alumnos/:alumnoId', async (req, res) => {//Finalizar clase para un alumno
        const { alumnoId } = req.params;
        const usuarioId = req.usuario.id;
        const { asignatura_id } = req.body;
        try {
            const [result] = await deleteByAlumno(usuarioId, asignatura_id, alumnoId);

            const alumnos = await getAlumnosWhithClasesByProfesorId(usuarioId);

            res.json(alumnos);
        } catch (error) {
            res.status(503).json({ Error: error.message });
        }

    });

router.delete('/clases/:asignaturaId', async (req, res) => {//finalizar clase de profesor y asignatura y para todos los alumnos
    const { asignaturaId } = req.params;
    const usuarioId = req.usuario.id;

    try {
        await updateClase(usuarioId, asignaturaId, req.body);
        await deleteByPrAs(usuarioId, asignaturaId); //finalizamos la clase a todos los alumnos inscritos
        const profesor = await getProfesorAndClases(req.usuario);
        res.json(profesor);

    } catch (error) {
        res.status(503).json({ Error: error.message });
    }

});

router.delete('/asignaturas/:asignaturaId', async (req, res) => {//Eliminar asignatura a profesor
    const { asignaturaId } = req.params;
    const usuarioId = req.usuario.id;

    try {
        const [result] = await getByAsignaturaAndProfesorId(usuarioId, asignaturaId);

        if (result.length === 0) {
            return res.json('Error: El profesor no tiene esta asignatura')
        }

        await deleteByAsignaturaAndProfesorId(usuarioId, asignaturaId);

        if (result[0].clase === 1) {//Comprobamos si la asignatura tiene clase y si tiene la finalizamos para los alumnos
            await deleteByPrAs(usuarioId, asignaturaId);
        }

        const profesor = await getProfesorAndClases(req.usuario);
        res.json(profesor);
    } catch (error) {
        res.status(503).json({ Error: error.message });
    }
});

module.exports = router;