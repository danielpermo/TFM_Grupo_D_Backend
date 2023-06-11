const getAsiganturasByProfesorId = (profesorId) => {
    return db.query('SELECT pa.asignatura_id, a.nombre, pa.clase FROM profesores_asignaturas AS pa, asignaturas AS a WHERE pa.profesor_id=? AND pa.asignatura_id=a.id;', [profesorId]);
}

const getByAsignaturaAndProfesorId = (profesorId, asignaturaId) => {
    return db.query('SELECT pa.asignatura_id, a.nombre, pa.clase FROM profesores_asignaturas AS pa, asignaturas AS a WHERE pa.profesor_id=? AND pa.asignatura_id=? AND pa.asignatura_id=a.id;', [profesorId, asignaturaId]);
}

const getClasesActivasByProfesorId = (profesorID) => {
    return db.query('SELECT * FROM profesores_asignaturas WHERE profesor_id=? AND clase=1', [profesorID]);
};

const getClasesActivas = () => {
    return db.query('SELECT pa.profesor_id, u.nombre, u.apellidos, pa.asignatura_id, a.nombre AS asignatura FROM profesores_asignaturas AS pa, asignaturas AS a, usuarios AS u WHERE pa.profesor_id=u.id AND pa.asignatura_id=a.id AND pa.clase=1');
}

const create = (profesorId, asignaturaId) => {
    return db.query('INSERT INTO profesores_asignaturas (profesor_id, asignatura_id) VALUES (?,?)', [profesorId, asignaturaId]);
}

const updateClase = (profesorId, asignaturaId, { clase }) => {
    return db.query('UPDATE profesores_asignaturas SET clase=? WHERE profesor_id=? AND asignatura_id=?', [clase, profesorId, asignaturaId]);
}

const deleteByAsignaturaAndProfesorId = (profesorId, asignaturaId) => {
    return db.query('DELETE FROM profesores_asignaturas WHERE profesor_id=? AND asignatura_id=?', [profesorId, asignaturaId]);
}

module.exports = {
    getAsiganturasByProfesorId, getByAsignaturaAndProfesorId, getClasesActivasByProfesorId, getClasesActivas, create, updateClase, deleteByAsignaturaAndProfesorId
}