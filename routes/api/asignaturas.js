const { getAll, getById, getByRama, getByNombre, create, update, getByProAsig } = require('../../models/asignatura.model');

const router = require('express').Router();

router.get('/', async (req, res) => {
    try {
        const [result] = await getAll();

        res.json(result);
    } catch (error) {
        res.status(503).json({ fatal: error.message });
    }

});

router.get('/filtro', async (req, res) => {

    try {

        const [asignaturasRama] = await getByRama(req.body.rama);
        const [asignaturasNombre] = await getByNombre(req.body.nombre);

        console.log(req.body.rama);
        console.log(req.body.nombre);

        const asignaturas = asignaturasRama.concat(asignaturasNombre);

        const resultado = asignaturas.filter((valor, indice, arreglo) => {
            return (
                arreglo.map(item => item.id).indexOf(valor.id) === indice
            );
        });

        res.json(resultado);

    } catch (error) {

        res.json({ fatal: error.message })
    }

});

router.get('/:asignaturaId', async (req, res) => {

    const { asignaturaId } = req.params;
    try {
        const asignatura = await getById(asignaturaId);

        if (asignatura.length === 0) {
            return res.json({ fatal: 'No existe una asignatura con ese ID' });
        }

        res.json(asignatura[0]);

    } catch (error) {

        res.json({ fatal: error.message });
    }
});

/*router.get('/:profesorId/:asignaturaId', async (req, res) => {
    try {
        const [res] = await getByProAsig(req.params.profesorId, req.params.asignaturaId);

        res.json(res);

    } catch (error) {

        res.json({ fatal: error.message });
    }

})*/

router.put('/:asignaturaId', async (req, res) => {
    try {
        const { asignaturaId } = req.params;
        await update(asignaturaId, req.body);
        const [asignatura] = await getById(asignaturaId);
        res.json(asignatura[0]);

    } catch (error) {
        res.status(500).json({ fatal: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const [result] = await create(req.body);
        const [newAsignatura] = await getById(result.insertId)
        res.json(newAsignatura[0]);
    } catch (error) {
        res.status(500).json({ fatal: error.message });
    }
})

module.exports = router;