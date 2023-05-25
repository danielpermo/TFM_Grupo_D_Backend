//obtener el listado de alumnos o profesores si borrados viene sin valor es falso y no se muestran los borrados, si es true su muestran
const getByRol = (rol, borrados = false) => {
    const queryBorrados = (!borrados) ? ' AND borrado=0' : '';
    return db.query(`SELECT * FROM usuarios WHERE rol=?${queryBorrados}`, [rol]);
}
//obtener por id un usuario si borrado viene sin valor es falso y no se muestran si esta borrado, si viene true se muestra
const getById = (userId, borrado = false) => {
    const queryBorrado = (!borrado) ? ' AND borrado=0' : '';
    return db.query(`SELECT * FROM usuarios WHERE id=?${queryBorrado}`, [userId]);
}

const getByEmail = (email) => {
    return db.query('SELECT * FROM usuarios WHERE email=? AND borrado=0', [email]);
}

const create = ({ nombre, apellidos, username, email, password, telefono, direccion, ciudad, latitud, longitud, edad, fecha_nacimiento, genero, dni, rol }) => {
    return db.query(
        'INSERT INTO usuarios (nombre, apellidos, username, email, password, telefono, direccion, ciudad, latitud, longitud, edad, fecha_nacimiento, genero, dni, rol) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
        [nombre, apellidos, username, email, password, telefono, direccion, ciudad, latitud, longitud, edad, fecha_nacimiento, genero, dni, rol]);
}

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