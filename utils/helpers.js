const dayjs = require('dayjs');
const jwt = require('jsonwebtoken');
const NodeGeocoder = require('node-geocoder');
const { getMediaPuntuacion } = require('../models/clase.model');
const { getAsiganturasByProfesorId } = require('../models/profesor_asignatura.model');

const createToken = (usuario) => {
    const dataToken = {
        usuario_id: usuario.id,
        usuario_rol: usuario.rol,
        exp: dayjs().add(1, 'days').unix()
    }
    return jwt.sign(dataToken, 'TFM Grupo D');
};

const getCoordenadas = async (direccion, ciudad) => {
    const options = {
        provider: 'openstreetmap',
        city: ciudad,
        country: 'España',
        countrycodes: 'es',
        format: 'json',
        limit: 1
    }
    const direccionCompleta = `${direccion}, ${ciudad}, España`;
    const geocoder = NodeGeocoder(options);
    try {
        const res = await geocoder.geocode(direccionCompleta);
        return res[0];
    } catch (error) {
        return error.message;
    }
};

const addAsignaturasValoracionAProfesores = async (profesores) => {
    
    try {
        for (let profesor of profesores) {
            const [puntuacion] = await getMediaPuntuacion(profesor.id);
            const media = puntuacion[0].media;
            profesor.puntuacion = (!media) ? 'No valorado' : media;
            const [asignaturas] = await getAsiganturasByProfesorId(profesor.id);
            profesor.asignaturas = asignaturas;
        }

        return profesores;
    } catch (error) {
        return error.message;
    }
}

module.exports = {
    createToken, getCoordenadas, addAsignaturasValoracionAProfesores
}
