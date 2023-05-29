const router = require('express').Router();

const { getProfesoresPublic } = require('../../models/profesor.model');
const { getAsiganturasByProfesorId } = require('../../models/profesor_asignatura.model');

router.get('/', async (req, res) => {
    try {

        const [usuarios] = await getProfesoresPublic();
        if (usuarios.length === 0) {
            return res.json('Error, no hay profesores');
        }

        for (let usuario of usuarios) {
            const [asignaturas] = await getAsiganturasByProfesorId(usuario.id);
            usuario.asignaturas = asignaturas;
        }

        res.json(usuarios);
    } catch (error) {
        res.status(503).json({ Error: error.message });
    }
})

module.exports = router;