const {
    obtenerPersonaConMascota,
    obtenerTodasLasPersonas,
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

module.exports = {
    obtenerDuenoPorId,
    obtenerTodosLosDuenos,
};
