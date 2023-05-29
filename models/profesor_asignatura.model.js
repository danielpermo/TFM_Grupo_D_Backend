const create = (profesorId, asignaturaId) => {
    return db.query('INSERT INTO profesores_asignaturas (profesor_id, asignatura_id) VALUES (?,?)', [profesorId, asignaturaId]);
}

const getAsiganturasByProfesorId = (profesorId) => {
    return db.query('SELECT pa.asignatura_id, a.nombre FROM profesores_asignaturas AS pa, asignaturas AS a WHERE pa.profesor_id=? AND pa.asignatura_id=a.id;', [profesorId]);
}

module.exports = {
    create, getAsiganturasByProfesorId
}