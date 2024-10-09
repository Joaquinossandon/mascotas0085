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

const agregarMascota = async ({
    id_dueno,
    nombre,
    especie,
    raza,
    fecha_nacimiento,
    sexo,
}) => {
    try {
        const agregado = await db.query({
            text: "INSERT INTO mascotas (id_dueno, nombre, especie, raza, fecha_nacimiento, sexo) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
            values: [id_dueno, nombre, especie, raza, fecha_nacimiento, sexo],
        });
    
        return agregado;
    } catch (error) {
        throw new Error(error)
    }
};

const editarMascota = async ({
    id,
    id_dueno,
    nombre,
    especie,
    raza,
    fecha_nacimiento,
    sexo,
}) => {
    const edicion = await db.query(
        "UPDATE mascotas SET id_dueno=$1, nombre=$2, especie=$3, raza=$4, fecha_nacimiento=$5, sexo=$6 WHERE id=${$7} RETURNING *",
        [id_dueno, nombre, especie, raza, fecha_nacimiento, sexo, id]
    );

    return edicion;
};

module.exports = {
    obtenerMascota,
    obtenerSexoMascotas,
    obtenerMascotasPorDueno,
    obtenerTodasLasMascotas,
    agregarMascota,
    editarMascota,
};
