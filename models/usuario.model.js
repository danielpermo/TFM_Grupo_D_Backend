//obtener el listado de alumnos o profesores si borrados viene sin valor es falso y no se muestran los borrados, si es true su muestran todos
const getByRol = (rol, borrados = false) => {
    const queryBorrados = (!borrados) ? ' AND borrado=0' : '';
    return db.query(`SELECT * FROM usuarios WHERE rol=?${queryBorrados}`, [rol]);
}
//obtener por id un usuario, si borrado viene sin valor es falso y no se muestra si esta borrado, si viene true se muestra este borrado o no
const getById = (userId, borrado = false) => {
    const queryBorrado = (!borrado) ? ' AND borrado=0' : '';
    return db.query(`SELECT * FROM usuarios WHERE id=?${queryBorrado}`, [userId]);
}

const getByEmail = (email) => {
    return db.query('SELECT * FROM usuarios WHERE email=? AND borrado=0', [email]);
}

const getAlumnosByProfesorID = (profesorId) => { //obtener los alumnos de un profesor
    return db.query('SELECT u.* FROM clases AS c, usuarios AS u WHERE c.profesor_id = ? AND u.id=c.alumno_id AND u.borrado=0 GROUP BY c.alumno_id', [profesorId]);
}

const getAlumnoByIdAndProfesorId = (profesorId, alumnoId) => { //obtener un alumno de un profesor,lo limito a 1 por si tiene varias clases con ese profesor
    return db.query('SELECT u.* FROM clases AS c, usuarios AS u WHERE c.profesor_id = ? AND c.alumno_id=? AND u.id=c.alumno_id AND u.borrado=0 LIMIT 1', [profesorId, alumnoId]);
}

const getAlumnosByProfesorAsignaturaId = (profesorId, asignaturaId) => { //obtener alumnos por profesorId y asignaturaId
    return db.query('SELECT u.*, c.puntuacion, c.opinion FROM clases AS c, usuarios AS u WHERE c.profesor_id = ? AND c.asignatura_id=? AND u.id=c.alumno_id AND u.borrado=0;', [profesorId, asignaturaId]);
}


const create = ({ nombre, apellidos, username, email, password, telefono, direccion, ciudad, latitud, longitud, imagen, edad, fecha_nacimiento, genero, dni, rol }) => {
    return db.query(
        'INSERT INTO usuarios (nombre, apellidos, username, email, password, telefono, direccion, ciudad, latitud, longitud, imagen, edad, fecha_nacimiento, genero, dni, rol) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
        [nombre, apellidos, username, email, password, telefono, direccion, ciudad, latitud, longitud, imagen, edad, fecha_nacimiento, genero, dni, rol]);
}

const update = (usuarioId, { nombre, apellidos, username, email, telefono, direccion, ciudad, latitud, longitud, imagen, edad, fecha_nacimiento, genero, dni, rol }) => {
    return db.query(
        'UPDATE usuarios SET nombre=?, apellidos=?, username=?, email=?, telefono=?, direccion=?, ciudad=?, latitud=?, longitud=?, imagen=?, edad=?, fecha_nacimiento=?, genero=?, dni=?, rol=? WHERE id=?',
        [nombre, apellidos, username, email, telefono, direccion, ciudad, latitud, longitud, imagen, edad, fecha_nacimiento, genero, dni, rol, usuarioId]
    );
}

//borrado lógico de usuarios
const deleteById = (usuarioId, { borrado }) => {
    return db.query('UPDATE usuarios SET borrado=? WHERE id=?', [borrado, usuarioId]);
}

module.exports = {
    create, getById, getByEmail, getByRol, getAlumnosByProfesorID, getAlumnoByIdAndProfesorId, getAlumnosByProfesorAsignaturaId, update, deleteById
}