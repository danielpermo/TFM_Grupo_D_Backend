const getByUsuarioId = (usuarioId) => {
    return db.query('SELECT * FROM profesores WHERE usuario_id=?', [usuarioId]);
}

const update = (usuarioId, { experiencia, precio, validado }) => {
    return db.query('UPDATE profesores SET experiencia=?, precio=?, validado=? WHERE usuario_id=?', [experiencia, precio, validado],)
}
const updateValidacion = (usuarioId, { validado }) => {
    return db.query('UPDATE profesores SET validado=? WHERE usuario_id=?', [validado, usuarioId,]);
}

module.exports = {
    getByUsuarioId, update, updateValidacion
}