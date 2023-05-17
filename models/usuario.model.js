//obtener el listado de alumnos o profesores no borrados
const getByRol = (rol) => {
    return db.query('SELECT * FROM usuarios WHERE rol=? AND borrado=0', [rol]);
}
const getById = (userId) => {
    return db.query('SELECT * FROM usuarios WHERE id=? AND borrado=0', [userId]);
}

const getByEmail = (email) => {
    return db.query('SELECT * FROM usuarios WHERE email=? AND borrado=0', [email]);
}

const create = ({ nombre, apellidos, username, email, password, telefono, direccion, ciudad, latitud, longitud, edad, fecha_nacimiento, genero, dni, rol }) => {
    return db.query(
        'INSERT INTO usuarios (nombre, apellidos, username, email, password, telefono, direccion, ciudad, latitud, longitud, edad, fecha_nacimiento, genero, dni, rol) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
        [nombre, apellidos, username, email, password, telefono, direccion, ciudad, latitud, longitud, edad, fecha_nacimiento, genero, dni, rol]);
}

//antes de pasar los valores encriptar password
const update = (usuarioId, { nombre, apellidos, username, email, password, telefono, direccion, ciudad, latitud, longitud, edad, fecha_nacimiento, genero, dni, rol }) => {
    return db.query(
        'UPDATE usuarios SET nombre=?, apellidos=?, username=?, email=?, password=?, telefono=?, direccion=?, ciudad=?, latitud=?, longitud=?, edad=?, fecha_nacimiento=?, genero=?, dni=?, rol=? WHERE id=?',
        [nombre, apellidos, username, email, password, telefono, direccion, ciudad, latitud, longitud, edad, fecha_nacimiento, genero, dni, rol, usuarioId]
    );
}

//borrado lógico de usuarios
const deleteById = (usuarioId) => {
    return db.query('UPDATE usuarios SET borrado=1 WHERE id=?', [usuarioId]);
}

module.exports = {
    create, getById, getByEmail, getByRol, update, deleteById
}