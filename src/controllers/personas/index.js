const {
    obtenerPersonaConMascota,
    obtenerTodasLasPersonas,
    agregarPersona,
    editarPersona,
    agregarPersonaConMascotas,
} = require("../../models/personas");
const db = require("../../db");

const obtenerDuenoPorId = async (req, res) => {
    const { id } = req.params;

    const persona = obtenerPersonaConMascota(id);

    res.status(200).json({
        result: persona,
    });
};

const obtenerTodosLosDuenos = async (req, res) => {
    const personas = await obtenerTodasLasPersonas();
    res.status(200).json(personas);
};

const AgregarPersona = async (req, res) => {
    try {
        const { nombre, telefono, direccion, email } = req.body;
        const nuevaPersona = { nombre, telefono, direccion, email };

        const respuesta = await agregarPersona(nuevaPersona);

        res.status(200).json(respuesta);
    } catch (error) {
        res.status(500).json({
            msg: "Hubo un error",
            error,
        });
    }
};

const EditarPersona = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, telefono, direccion, email } = req.body;

        const editPersona = { id, nombre, telefono, direccion, email };

        const respuesta = await editarPersona(editPersona);

        res.status(200).json(respuesta);
    } catch (error) {
        res.status(500).json({
            msg: "Ocurrió un error",
            error,
        });
    }
};

const AgregarPersonaConMascotas = async (req, res) => {
    try {
        const personaConMascotas = req.body;
        const resultado = await agregarPersonaConMascotas(personaConMascotas);

        res.status(200).json(resultado);
    } catch (error) {
        res.status(400).json({ msg: "Ocurrió un error", error });
    }
};

module.exports = {
    obtenerDuenoPorId,
    obtenerTodosLosDuenos,
    AgregarPersona,
    EditarPersona,
    AgregarPersonaConMascotas,
};

// ESTAMOS EN BREAK, VOLVEMOS A LAS 10:22
