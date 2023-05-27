const dayjs = require('dayjs');
const jwt = require('jsonwebtoken');
const NodeGeocoder = require('node-geocoder');

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

module.exports = {
    createToken, getCoordenadas
}
