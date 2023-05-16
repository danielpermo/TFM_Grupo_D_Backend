const router = require('express').Router();
const bcrypt = require('bcryptjs');

const { create, getById } = require('../../models/usuario.model');
const { getById: getAsignaturaById } = require('../../models/asignatura.model');
const { create: createProfeAsignatura } = require('../../models/profesor_asignatura.model')

router.post('/registro', async (req, res) => {
    req.body.password = bcrypt.hashSync(req.body.password, 8); //encriptamos password
    try {
        const [result] = await create(req.body);
        const [usuarioArr] = await getById(result.insertId);
        const usuario = usuarioArr[0];

        if (req.body.rol != "profe") {
            return res.json(usuario);
        }
        //añadir registro a tabla profesor
        //const [resultProfe] = await createProfe(result.insertId, req.body)// pasamos userId y valores

        const asignaturasArr = req.body.asignaturas;
        if (asignaturasArr === 0) {
            return res.json(usuario);
        }
        const asignaturas = [];
        for (let asignatura of asignaturasArr) {
            const [result] = await getAsignaturaById(asignatura);
            if (result.length > 0) {
                await createProfeAsignatura(usuario.id, asignatura);
                asignaturas.push(result[0].nombre);
            }
        }
        usuario.asignaturas = asignaturas;

        res.json(usuario);
    } catch (error) {
        res.status(503).json({ Error: error.message });
    }
})

module.exports = router;