

const getAll = () => {

    return db.query('select * from asignaturas');
}

const getById = (asignaturaId) => {

    return db.query('select * from asignaturas where id = ?', [asignaturaId]);
}

const getByNombre = (nombre) => {

    return db.query('select * from asignaturas where nombre = ?', [nombre]);
}

const getByRama = (rama) => {
    return db.query('select * from asignaturas where rama = ?', [rama]);
}

const getByProAsig = (profesorId, asignaturaId) => {
    return db.query('select * from asignaturas where profesor_id = ? and asignatura_id = ?', [profesorId, asignaturaId]);
}

const update = (asignaturaId, { nombre, rama }) => {
    return db.query(
        'update asignaturas set nombre = ?, rama = ? where id = ?',
        [nombre, rama, asignaturaId]
    )
}

const deleteById = (asignaturaId) => {

    return db.query('delete from asignaturas where id = ?', [asignaturaId]);
}

const create = ({ nombre, rama }) => {
    return db.query(
        'insert into asignaturas (nombre, rama) values (?, ?)',
        [nombre, rama]
    )
}

module.exports = {

    getAll, getById, getByNombre, getByRama, deleteById, create, update, getByProAsig
}