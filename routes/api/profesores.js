const router = require('express').Router();

const { getProfesoresPublic, getByCiudad, getByAsignatura } = require('../../models/profesor.model');
const { addAsignaturasValoracionAProfesores } = require('../../utils/helpers');

router.get('/', async (req, res) => {
    try {

        const [usuarios] = await getProfesoresPublic();
        if (usuarios.length === 0) {
            return res.json('No hay profesores');
        }

        const profesores = await addAsignaturasValoracionAProfesores(usuarios);
        res.json(profesores);
    } catch (error) {
        res.status(503).json({ Error: error.message });
    }
})

router.get('/ciudad/:ciudad', async (req, res) => {
    const { ciudad } = req.params;

    try {
        const [usuarios] = await getByCiudad(ciudad);
        if (usuarios.length === 0) {
            return res.json('No hay profesores en la ciudad seleccionada');
        }

        const profesores = await addAsignaturasValoracionAProfesores(usuarios);
        res.json(profesores);
    } catch (error) {
        res.status(503).json({ Error: error.message });
    }
});

router.get('/asignatura/:asignaturaId', async (req, res) => {
    const { asignaturaId } = req.params;

    try {
        const [usuarios] = await getByAsignatura(asignaturaId);
        if (usuarios.length === 0) {
            return res.json('No hay profesores que impartan la asignatura');
        }

        const profesores = await addAsignaturasValoracionAProfesores(usuarios);
        res.json(profesores);
    } catch (error) {
        res.status(503).json()
    }
})

module.exports = router;