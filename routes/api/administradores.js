const router = require('express').Router();

const { getByRol, getById: getUsuarioById, deleteById } = require('../../models/usuario.model');
const { getByUsuarioId: getProfeByUsuarioId, update: updateProfesor } = require('../../models/profesor.model');

router.get('/:usuarioId', async (req, res) => {
    const { usuarioId } = req.params;

    try {
        const [result] = await getUsuarioById(usuarioId, true);
        let usuario = result[0];

        if (usuario.rol !== 'profe') {
            return res.json(usuario);
        }

        const resultProfe = await getProfeByUsuarioId(usuarioId)
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

router.put('/:usuarioId', async (req, res) => {//validar profesor
    const { usuarioId } = req.params;

    try {
        await updateProfesor(req.body, usuarioId);
        const [result] = await getProfeByUsuarioId(usuarioId)

        if (result.length === 0) {
            return res.json('Error: el usuario no existe');
        }

        const profesor = result[0];
        delete profesor.id;
        delete profesor.usuario_id;

        const [resulUsuario] = await getUsuarioById(usuarioId);
        const usuario = { ...resulUsuario[0], ...profesor }
        res.json(usuario)
    } catch (error) {
        res.status(503).json({ Error: error.message });
    }
});

router.delete('/:usuarioId', async (req, res) => { //borrado logico o recuperación logica
    const { usuarioId } = req.params;
    const { borrado } = req.body;

    if (borrado === undefined) {
        req.body.borrado = 1;
    }

    try {
        await deleteById(req.body, usuarioId);
        const [result] = await getUsuarioById(usuarioId, true);

        if (result.length === 0) {
            return res.json('Error: El usuario no exite');
        }

        res.json(result[0]);
    } catch (error) {
        res.status(503).json({ Error: error.message });
    }
});

module.exports = router;