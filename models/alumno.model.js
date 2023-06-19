

const getAll = () => {

    return db.query('select * from usuarios where rol = ? and borrado = ?', ['alum', 0]);
}

const getAllUsers = () => {

    return db.query('select * from usuarios where borrado = ?', [0]);
}

const getById = (alumnoId) => {

    return db.query('select * from usuarios where id = ? and rol = ? and borrado = ?', [alumnoId, 'alum', 0]);
}

const getProfesorById = (profesorId) => {

    return db.query('SELECT * from profesores where usuario_id = ?', [profesorId]);
}

const getByNombre = ({ nombre, apellido }) => {

    return db.query('select * from usuarios where nombre = ? and apellidos = ? and borrado = ?', [nombre, apellido, 0]);
}

const getByEmail = (email) => {
    console.log('Hola esto rama');
    return db.query('select * from usuarios where email = ? and borrado = ?', [email, 0]);
}

const deleteById = (usuarioId) => {

    return db.query('delete from usuarios where id = ? and rol = ?', [usuarioId, 'alum']);
}

/* NO ES NECESARIO; SE HACE EN USUARIOS
const create = ({nombre, apellidos, username, email, password, telefono, direccion, ciudad, latitud, longitud, edad, fecha_nacimiento, genero, dni, fecha_alta, rol, borrado}) => {
    return db.query(
        'insert into usuarios (nombre, apellidos, username, email, password, telefono, direccion, ciudad, latitud, longitud, edad, fecha_nacimiento, genero, dni, fecha_alta, rol, borrado) values (?, ?, ?, ?, ?, ?, ?, ? ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [nombre, experiencia]
)};
*/

const update = (alumnoId, { nombre, apellidos, username, email, imagen, password, telefono, direccion, ciudad, edad, genero, dni }) => {
    return db.query(
        'update usuarios set nombre = ?, apellidos = ?, username = ?, email = ?, imagen = ?, password = ?, telefono = ?, direccion = ?, ciudad = ?, edad = ?, genero = ?, dni = ? where id = ?',
        [nombre, apellidos, username, email, imagen, password, telefono, direccion, ciudad, edad, genero, dni, alumnoId]
    )
}

module.exports = {

    getAll, getById, getByNombre, deleteById, update, getProfesorById, getAllUsers
}

