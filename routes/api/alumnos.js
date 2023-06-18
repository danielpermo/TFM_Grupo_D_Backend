const { getAsignaturasByAlumnoid, createClaseAlumno, updateOpinionValoracion } = require('../../models/clase.model');
const { getProfesorByUsuarioId, getByUsuarioId } = require('../../models/profesor.model');
const { getAll, getById, deleteById, getByNombre, getByEmail, update, getProfesorById } = require('../../models/alumno.model');
const { getClasesActivas } = require('../../models/profesor_asignatura.model');


const router = require('express').Router();

router.get('/', async (req, res) => {
    try {
        const [result] = await getAll();

        res.json(result);

    } catch (error) {
        res.status(503).json({ fatal: error.message });
    }

});


router.get('/clases', async (req, res) => {
    try {
        const [asignaturasActivas] = await getClasesActivas();

        const [asignaturasAlumno] = await getAsignaturasByAlumnoid(req.usuario.id);

        const result = asignaturasActivas.filter(asignatura1 => { return asignaturasAlumno.some(asignatura2 => asignatura1.asignatura_id === asignatura2.id) })


        res.json(result);

    } catch (error) {
        res.status(503).json({ fatal: error.message });
    }

});

router.get('/clasesActivas', async (req, res) => {
    try {
        const [asignaturasActivas] = await getClasesActivas();

        res.json(asignaturasActivas);

    } catch (error) {
        res.status(503).json({ fatal: error.message });
    }

});

router.get('/email', async (req, res) => {

    try {

        const [alumno] = await getByEmail(req.body.email);

        res.json(alumno[0]);

    } catch (error) {

        res.json({ fatal: error.message })
    }

});

router.get('/nombre', async (req, res) => {

    try {

        const [alumno] = await getByNombre(req.body);

        res.json(alumno[0]);

    } catch (error) {

        res.json({ fatal: error.message })
    }

});

router.get('/profesores', async (req, res) => {

    try {

        const [alumno] = await getAsignaturasByAlumnoid(req.usuario.id);
        var profesores = [];

        for(var i = 0; i < alumno.length; i++){

            const [res] = await getProfesorById(alumno[i].profesor_id);

            const [res2] = await getProfesorByUsuarioId(res[0].usuario_id);

            const [res3] = await getByUsuarioId(res[0].usuario_id);

            res2[0].precio = res3[0].precio;
            res2[0].experiencia = res3[0].experiencia;
            
            profesores.push(res2[0]);

        }

        var resultado = profesores.filter((objeto, index, self) =>
            index === self.findIndex((o) => o.id === objeto.id)
        );
        
        res.json(resultado);

    } catch (error) {

        res.json({ fatal: error.message })
    }

});

router.get('/:alumnoId', async (req, res) => {

    const { alumnoId } = req.params;
    try {
        const alumno = await getById(alumnoId);

        if (alumno.length === 0) {
            return res.json({ fatal: 'No existe un alumno con ese ID' });
        }

        res.json(alumno[0]);

    } catch (error) {

        res.json({ fatal: error.message });
    }
});

router.put('/ActualizarClase', async (req, res) => {

    try {
        await updateOpinionValoracion(req.body);
        res.json("Actualizado correctamente");

    } catch (error) {
        res.status(500).json({ fatal: error.message });
    }
})


router.put('/:alumnoId', async (req, res) => {
    try {
        const { alumnoId } = req.params;
        await update(alumnoId, req.body);
        const [alumno] = await getById(alumnoId);
        res.json(alumno[0]);

    } catch (error) {
        res.status(500).json({ fatal: error.message });
    }
})


router.post('/NuevaClase', async (req, res) => {
    try {
        const [result] = await createClaseAlumno(req.body, req.usuario.id);
        const [newClase] = await getById(result.insertId)
        res.json(newClase[0]);
    } catch (error) {
        res.status(500).json({ fatal: error.message });
    }
})

module.exports = router;