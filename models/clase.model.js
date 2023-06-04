

const getAll = () => {
    return db.query('select * from clases');
}

const getById = (claseId) => {
    return db.query('select * from clases where id = ?', [claseId]);
}

const getAllByProfesorId = (profesorId) => {

    return db.query('select * from clases where profesor_id = ?', [profesorId]);
 }

 const getMediaPuntuacion = (profesorId) => {

    return db.query('select AVG(puntuacion) as media from clases where profesor_id = ?', [profesorId]);
 }

 const create = ({profesor_id, asignatura_id, alumno_id, puntuacion, opinion}) => {
    return db.query(
        'insert into clases (profesor_id, asignatura_id, alumno_id, puntuacion, opinion) values (?, ?, ?, ? ,?)',
        [profesor_id, asignatura_id, alumno_id, puntuacion, opinion]
)};

const deleteById = (claseId) => {
    return db.query('UPDATE clases SET finalizado = 1 where id = ?', [claseId]);
};

const deleteByPrAs = ({profesor_id, asignatura_id}) => {
    return db.query('UPDATE clases SET finalizado = 1 where profesor_id = ? and asignatura_id = ?', [profesor_id, asignatura_id]);
};

const deleteByAlumno = ({profesor_id, asignatura_id, alumno_id }) => {
    return db.query('UPDATE clases SET finalizado = 1 where profesor_id = ? and asignatura_id = ? and alumno_id = ?', [profesor_id, asignatura_id, alumno_id]);
};

module.exports = {
    getAll, getAllByProfesorId, getMediaPuntuacion, create, getById, deleteById, deleteByPrAs, deleteByAlumno
}