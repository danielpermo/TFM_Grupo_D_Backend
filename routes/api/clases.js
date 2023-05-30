const { getAll, getAllByProfesorId, getMediaPuntuacion, create, getById, deleteById } = require('../../models/clase.model');


const router = require('express').Router();

router.get('/',async (req, res) => {
    try{

        const [result] = await getAll();

        res.json(result);
    } catch (error){
        res.status(503).json({ fatal: error.message });
    }

});

router.get('/media/:profesorId',async (req, res) => {
    try{

        const { profesorId } = req.params;

        const [result] = await getMediaPuntuacion(profesorId);

        res.json(result[0]);
    } catch (error){
        res.status(503).json({ fatal: error.message });
    }

});

router.get('/profesor/:profesorId',async (req, res) => {
    try{

        const { profesorId } = req.params;

        const [result] = await getAllByProfesorId(profesorId);

        res.json(result);
    } catch (error){
        res.status(503).json({ fatal: error.message });
    }

});

router.get('/:asignaturaId', async (req, res) => {

    const { claseId } = req.params;
    try {
        const clase = await getById(claseId);

        if(claseId.length === 0){
            return res.json({ fatal: 'No existe una clase con ese ID'});
        }

        res.json(clase[0]);

    } catch (error) {

        res.json({ fatal: error.message});
    }
});

router.post('/', async (req, res) => {
    try{
        const [result] = await create(req.body);
        const [newClase] = await getById(result.insertId)
        res.json(newClase[0]);
    }catch(error){
        res.status(500).json({ fatal: error.message });
    }
})

router.delete('/:claseId', async (req, res) => { //borrado logico
    const { claseId } = req.params;

    try {

        
        const [result] = await getById(claseId);
        
        if (result.length === 0) 
            return res.json('No existe clase con ese id');
        else
            await deleteById(claseId);

        res.json("Borrado correctamente");

    } catch (error) {
        res.status(503).json({ Error: error.message });
    }
});





module.exports = router;