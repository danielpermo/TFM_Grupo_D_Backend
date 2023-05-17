const create = (profesorId, asignaturaId) => {
    return db.query('INSERT INTO profesores_asignaturas (profesor_id, asignatura_id) VALUES (?,?)', [profesorId, asignaturaId]);
}

module.exports = {
    create
}