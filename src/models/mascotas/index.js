const Cursor = require("pg-cursor");
const db = require("../../db");

const obtenerMascota = async (id) => {
    const { rows } = await db.query("select * from mascotas where id = $1", [
        id,
    ]);
    return rows;
};

const obtenerTodasLasMascotas = async () => {
    const { rows, rowCount } = await db.query("SELECT * FROM mascotas");
    return {
        results: rows,
        count: rowCount,
    };
};

const obtenerMascotasPorDueno = async (id) => {
    const { rows: mascotas } = await db.query(
        `SELECT * FROM mascotas WHERE id_dueno = $1;`,
        [id]
    );

    return mascotas;
};

const obtenerSexoMascotas = async () => {
    const client = await db.connect();
    const cursor = client.query(new Cursor("SELECT sexo FROM mascotas"));

    return cursor;
};

module.exports = {
    obtenerMascota,
    obtenerSexoMascotas,
    obtenerMascotasPorDueno,
    obtenerTodasLasMascotas,
};
