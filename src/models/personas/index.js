const db = require("../../db");
const { obtenerMascotasPorDueno } = require("../mascotas");

const obtenerPersonaPorId = async (id) => {
    const { rows: dueno } = await db.query({
        text: `SELECT * FROM duenos WHERE id = $1`,
        values: [id],
    });

    return dueno[0];
};

const obtenerPersonaConMascota = async (id) => {
    const dueno = await obtenerPersonaPorId(id);
    const mascotas = await obtenerMascotasPorDueno(id);

    return {
        ...dueno,
        mascotas,
    };
};

const obtenerTodasLasPersonas = async () => {
    const { rows, rowCount } = await db.query("SELECT * FROM duenos");

    return {
        results: rows,
        count: rowCount,
    };
};

module.exports = {
    obtenerPersonaConMascota,
    obtenerTodasLasPersonas,
};
