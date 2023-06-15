const router = require('express').Router();

const { getByRol, getById: getUsuarioById, deleteById } = require('../../models/usuario.model');
const { updateValidacion, getProfesorByUsuarioId } = require('../../models/profesor.model');
const { addProfesorAUsuario } = require('../../utils/helpers');

router.get('/:usuarioId', async (req, res) => {
    const { usuarioId } = req.params;

    try {
        const [result] = await getUsuarioById(usuarioId);

        if (result.length === 0) {
            return res.json('El usuario no existe');
        }

        let usuario = result[0];
        delete usuario.password;

        if (usuario.rol !== 'profe') {
            return res.json(usuario);
        }

        const profesor = await addProfesorAUsuario(usuario);
        res.json(profesor);
    } catch (error) {
        res.status(503).json({ Error: error.message });
    }
})

router.get('/listado/:rol', async (req, res) => {
    const { rol } = req.params;

    try {
        const [usuarios] = await getByRol(rol);

        if (usuarios.length === 0) {
            return res.json('Error: no existen usuarios con ese rol');
        }

        if (rol !== 'profe') {
            return res.json(usuarios);
        }

        const profesores = [];

        for (let usuario of usuarios) {
            delete usuario.password;
            const profesor = await addProfesorAUsuario(usuario);
            profesores.push(profesor);
        }

        res.json(profesores);
    } catch (error) {
        res.status(503).json({ Error: error.message });
    }
});

router.patch('/:usuarioId', async (req, res) => {//validar profesor
    const { usuarioId } = req.params;

    try {
        await updateValidacion(usuarioId, req.body);
        const [result] = await getProfesorByUsuarioId(usuarioId, false);

        if (result.length === 0) {
            return res.json('Error: el usuario no existe');
        }

        res.json(result[0])
    } catch (error) {
        res.status(503).json({ Error: error.message });
    }
});

router.delete('/:usuarioId', async (req, res) => { //borrado logico
    const { usuarioId } = req.params;
    const { borrado } = req.body;

    if (borrado === undefined) {
        req.body.borrado = 1;
    }

    try {
        await deleteById(usuarioId, req.body);
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