const { getAll, getById, deleteById, getByNombre, getByEmail } = require('../../models/alumno.model');

const router = require('express').Router();

router.get('/', async (req, res) => {
    try {
        const [result] = await getAll();

        res.json(result);

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

router.get('/:alumnoId', async (req, res) => {

    console.log('hola');
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


module.exports = router;