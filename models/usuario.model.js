const getById = (userId) => {
    return db.query('SELECT * FROM usuarios WHERE id=?', [userId]);
}

const create = ({ nombre, apellidos, username, email, password, telefono, direccion, ciudad, latitud, longitud, edad, fecha_nacimiento, genero, dni, rol }) => {
    return db.query(
        'INSERT INTO usuarios (nombre, apellidos, username, email, password, telefono, direccion, ciudad, latitud, longitud, edad, fecha_nacimiento, genero, dni, rol) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
        [nombre, apellidos, username, email, password, telefono, direccion, ciudad, latitud, longitud, edad, fecha_nacimiento, genero, dni, rol]);
}


module.exports = {
    create, getById
}