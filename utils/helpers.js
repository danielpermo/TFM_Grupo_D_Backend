const dayjs = require('dayjs');
const jwt = require('jsonwebtoken');
const NodeGeocoder = require('node-geocoder');
const { getMediaPuntuacion, getAsignaturasByAlumnoAndProfesor, getOpinionMaxPuntuacion } = require('../models/clase.model');
const { getByUsuarioId } = require('../models/profesor.model');
const { getAlumnosByProfesorID } = require('../models/usuario.model');
const { getAsiganturasByProfesorId } = require('../models/profesor_asignatura.model');

const createToken = (usuario) => {
    const dataToken = {
        usuario_id: usuario.id,
        usuario_rol: usuario.rol,
        exp: dayjs().add(1, 'days').unix()
    }
    return jwt.sign(dataToken, 'TFM Grupo D');
};

const getCoordenadas = async (direccion, ciudad) => {
    const options = {
        provider: 'openstreetmap',
        city: ciudad,
        country: 'España',
        countrycodes: 'es',
        format: 'json',
        limit: 1
    }
    const direccionCompleta = `${direccion}, ${ciudad}, España`;
    const geocoder = NodeGeocoder(options);
    try {
        const res = await geocoder.geocode(direccionCompleta);
        return res[0];
    } catch (error) {
        return error.message;
    }
};

const addAsignaturasValoracionAProfesores = async (profesores) => {

    try {
        for (let profesor of profesores) {
            const [puntuacion] = await getMediaPuntuacion(profesor.id);
            const media = puntuacion[0].media;
            profesor.puntuacion = (!media) ? 'No valorado' : media;

            const [opinion] = await getOpinionMaxPuntuacion(profesor.id);
            const mejorOpinion = opinion[0];
            profesor.opinion = (!mejorOpinion || !mejorOpinion.opinion) ? 'No hay opiniones' : mejorOpinion.opinion;

            const [asignaturas] = await getAsiganturasByProfesorId(profesor.id);
            profesor.asignaturas = asignaturas;
        }

        return profesores;
    } catch (error) {
        return error.message;
    }
}

const addProfesorAUsuario = async (usuario) => {
    try {
        const [resultProfe] = await getByUsuarioId(usuario.id, false);

        if (resultProfe.length > 0) {
            const profesor = resultProfe[0];
            delete profesor.id;
            delete profesor.usuario_id;
            usuario = { ...usuario, ...profesor };
        }
        return usuario;
    } catch (error) {
        return error.message;
    }

}

const getAlumnosWhithClasesByProfesorId = async (profesorId) => {
    try {
        const [alumnos] = await getAlumnosByProfesorID(profesorId);

        if (alumnos.length === 0) {
            return 'No hay alumnos disponibles';
        }

        for (let alumno of alumnos) {
            const [asignaturas] = await getAsignaturasByAlumnoAndProfesor(alumno.id, profesorId);
            alumno.asignaturas = asignaturas;
        }
        return alumnos;
    } catch (error) {
        return error.message;
    }
}

const getProfesorAndClases = async (usuario) => {

    try {
        const profesor = await addProfesorAUsuario(usuario);
        const [asignaturas] = await getAsiganturasByProfesorId(usuario.id);
        profesor.asignaturas = asignaturas;
        delete profesor.password;
        return profesor;
    } catch (error) {
        return error.message;
    }
}

module.exports = {
    createToken, getCoordenadas, addAsignaturasValoracionAProfesores, addProfesorAUsuario, getAlumnosWhithClasesByProfesorId, getProfesorAndClases
}
