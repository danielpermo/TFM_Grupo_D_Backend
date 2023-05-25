const router = require('express').Router();

const { getByRol, getById: getUsuarioById } = require('../../models/usuario.model');
const { getByUsuarioId: getProfeByUsuarioId } = require('../../models/profesor.model');

router.get('/:userID', async (req, res) => {
    const { userID } = req.params;

    try {
        const [result] = await getUsuarioById(userID, true);
        let usuario = result[0];

        if (usuario.rol !== 'profe') {
            return res.json(usuario);
        }

        const resultProfe = await getProfeByUsuarioId(userID)
        if (resultProfe.length > 0) {
            const profesor = resultProfe[0];
            delete profesor.id;
            delete profesor.usuario_id;
            usuario = { ...usuario, ...profesor };
        }

        res.json(usuario);
    } catch (error) {
        res.status(503).json({ Error: error.message });
    }
})

router.get('/listado/:rol', async (req, res) => {
    const { rol } = req.params;

    try {
        const [usuarios] = await getByRol(rol, true);

        if (rol !== 'profe') {
            return res.json(usuarios);
        }

        const profesores = [];

        for (let usuario of usuarios) {
            const [result] = await getProfeByUsuarioId(usuario.id);

            if (result.length > 0) {
                const profesor = result[0];
                delete profesor.id;
                delete profesor.usuario_id;
                usuario = { ...usuario, ...profesor };
            }

            /*const profesor = { experiencia: 1, opinion: 5, validacion: 1 };//probar si funciona al no tener consultas tabla profesores
            usuario = { ...usuario, ...profesor };*/
            profesores.push(usuario);
        }
        res.json(profesores);
    } catch (error) {
        res.status(503).json({ Error: error.message });
    }
});

module.exports = router;