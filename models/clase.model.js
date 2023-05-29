

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
    return db.query('delete from clases where id = ?', [claseId]);
}

module.exports = {
    getAll, getAllByProfesorId, getMediaPuntuacion, create, getById, deleteById
}