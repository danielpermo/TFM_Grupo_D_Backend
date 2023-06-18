const getProfesoresPublic = () => {
    return db.query('SELECT u.id, u.nombre, u.apellidos, u.ciudad, u.imagen, p.experiencia, p.precio FROM usuarios AS u, profesores AS p WHERE u.rol="profe" AND u.id=p.usuario_id AND u.borrado=0 AND p.validado=1');
}

const getByUsuarioId = (usuarioId, validado = true) => {
    const validadoQuery = (validado) ? ' AND validado=1' : ''; //Por defecto solo vemos los profesores validados, pero si pasamos falso vemos todos (administradores)
    return db.query(`SELECT * FROM profesores WHERE usuario_id=?${validadoQuery}`, [usuarioId]);
}

const getProfesorByUsuarioId = (usuarioId, validado = true) => {
    const validadoQuery = (validado) ? ' AND validado=1' : '';//Por defecto solo vemos los profesores validados, pero si pasamos falso vemos todos (administradores)
    return db.query(`SELECT u.*, p.experiencia, p.precio, p.validado FROM usuarios AS u, profesores AS p WHERE u.id=? AND u.id=p.usuario_id AND u.rol="profe" AND u.borrado=0${validadoQuery}`, [usuarioId]);
}

const getByCiudad = (ciudad) => {
    return db.query('SELECT u.id, u.nombre, u.apellidos, u.ciudad, u.imagen, p.experiencia, p.precio FROM usuarios AS u, profesores AS p WHERE u.rol="profe" AND u.id=p.usuario_id AND u.borrado=0 AND p.validado=1 AND u.ciudad LIKE ?', [ciudad]);
}

const getByAsignatura = (asignaturaId) => {
    return db.query('SELECT u.id, u.nombre, u.apellidos, u.ciudad, u.imagen, p.experiencia, p.precio FROM usuarios AS u, profesores AS p, profesores_asignaturas AS pa WHERE u.rol="profe" AND u.id=p.usuario_id AND u.borrado=0 AND p.validado=1 AND pa.profesor_id=u.id AND pa.asignatura_id=?', [asignaturaId]);
}

const getByCiudadAndAsignatura = (ciudad, asignaturaId) => {
    return db.query('SELECT u.id, u.nombre, u.apellidos, u.ciudad, u.imagen, p.experiencia, p.precio FROM usuarios AS u, profesores AS p, profesores_asignaturas AS pa WHERE u.rol="profe" AND u.borrado=0 AND p.validado=1 AND u.id=p.usuario_id AND pa.profesor_id=u.id AND u.ciudad=? AND pa.asignatura_id=?', [ciudad, asignaturaId]);
}

const create = (usuarioId, { experiencia, precio }) => {
    return db.query('INSERT INTO profesores (experiencia, precio, usuario_id) VALUES (?,?,?)', [experiencia, precio, usuarioId]);
}

const update = (usuarioId, { experiencia, precio }) => {
    return db.query('UPDATE profesores SET experiencia=?, precio=? WHERE usuario_id=?', [experiencia, precio, usuarioId])
}
const updateValidacion = (usuarioId, { validado }) => {
    return db.query('UPDATE profesores SET validado=? WHERE usuario_id=?', [validado, usuarioId,]);
}

module.exports = {
    getProfesoresPublic, getByUsuarioId, getProfesorByUsuarioId, getByCiudad, getByAsignatura, getByCiudadAndAsignatura, create, update, updateValidacion
}