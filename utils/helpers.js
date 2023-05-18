const dayjs = require('dayjs');
const jwt = require('jsonwebtoken');

const createToken = (usuario) => {
    const dataToken = {
        usuario_id: usuario.id,
        usuario_rol: usuario.rol,
        exp: dayjs().add(1, 'days').unix()
    }
    return jwt.sign(dataToken, 'TFM Grupo D');
}

module.exports = {
    createToken
}
