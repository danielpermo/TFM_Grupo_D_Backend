const getProfesoresPublic = () => {
    return db.query('SELECT u.id, u.nombre, u.apellidos FROM usuarios AS u, profesores AS p WHERE u.rol="profe" AND u.id=p.usuario_id AND u.borrado=0 AND p.validado=1');
}

const getByUsuarioId = (usuarioId, validado = false) => {
    const validadoQuery = (validado) ? ' AND validado=1' : '';
    return db.query(`SELECT * FROM profesores WHERE usuario_id=?${validadoQuery}`, [usuarioId]);
}

const getProfesorByUsuarioId = (usuarioId) => {
    return db.query('SELECT * FROM usuarios AS u, profesores AS p WHERE u.id=? AND u.id=p.usuario_id AND u.rol="profe" AND u.borrado=0 AND p.validado=1');
}

const update = (usuarioId, { experiencia, precio, validado }) => {
    return db.query('UPDATE profesores SET experiencia=?, precio=?, validado=? WHERE usuario_id=?', [experiencia, precio, validado],)
}
const updateValidacion = (usuarioId, { validado }) => {
    return db.query('UPDATE profesores SET validado=? WHERE usuario_id=?', [validado, usuarioId,]);
}

module.exports = {
    getProfesoresPublic, getByUsuarioId, getProfesorByUsuarioId, update, updateValidacion
}