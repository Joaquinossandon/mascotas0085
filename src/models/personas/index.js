const db = require("../../db");
const { obtenerMascotasPorDueno, agregarMascota } = require("../mascotas");

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

const agregarPersona = async ({ nombre, telefono, direccion, email }) => {
    const { rows } = await db.query(
        "INSERT INTO duenos (nombre, telefono, direccion, email) VALUES ($1, $2, $3, $4) RETURNING *",
        [nombre, telefono, direccion, email]
    );

    return rows;
};

const editarPersona = async ({ nombre, telefono, direccion, email, id }) => {
    try {
        const { rows } = await db.query(
            "UPDATE duenos SET nombre=$2, telefono=$3, direccion=$4, email=$5 WHERE id=$1 RETURNING *",
            [id, nombre, telefono, direccion, email]
        );

        return rows;
    } catch (error) {
        throw new Error("ocurrió un error en la query");
    }
};

const agregarPersonaConMascotas = async (personaMascotas) => {
    const { nombre, telefono, direccion, email, mascotas } = personaMascotas;
    try {
        const client = await db.connect();
        await client.query("BEGIN");

        const { rows } = await client.query(
            "INSERT INTO duenos (nombre, telefono, direccion, email) VALUES ($1, $2, $3, $4) RETURNING id",
            [nombre, telefono, direccion, email]
        ); // rows tiene un arreglo, en este caso de un solo elemento => [{id: ID}]
        const id_dueno = rows[0].id;

        // ATENCION: forEach no es compatible con la asincronía, para estos casos, es mejor usar for of o un map
        // si usamos un map, debemos tambien utilizar un promise.all para resolver todas las promesas resultantes de la iteracion.

        // mascotas.forEach(async () => {
        //     await client.query(
        //         "INSERT INTO mascotas (id_dueno, nombre, especie, raza, fecha_nacimiento, sexo) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
        //         [id_dueno, nombre, especie, raza, fecha_nacimiento, sexo]
        //     );
        // });

        for (let {
            nombre,
            especie,
            raza,
            fecha_nacimiento,
            sexo,
        } of mascotas) {
            await client.query(
                "INSERT INTO mascotas (id_dueno, nombre, especie, raza, fecha_nacimiento, sexo) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
                [id_dueno, nombre, especie, raza, fecha_nacimiento, sexo]
            );
        }

        await client.query("COMMIT");
        client.release();
        return {
            message: "todo ok",
        };
    } catch (error) {
        await db.query("ROLLBACK");
        throw new Error(error);
    }
};

const eliminarDuenoYTransferirMascotas = async (
    duenoEliminar,
    duenoAsignar
) => {
    const client = await db.connect();
    try {
        await client.query("BEGIN");

        const { rows: nombresMascota } = await client.query(
            "UPDATE mascotas SET id_dueno=$2 WHERE id_dueno=$1 RETURNING nombre",
            [duenoEliminar, duenoAsignar]
        );

        const { rows: duenoAsignado } = await client.query(
            "SELECT * FROM duenos WHERE id=$1",
            [duenoAsignar]
        );

        const { rows: duenoEliminado } = await client.query(
            "DELETE FROM duenos WHERE id=$1 RETURNING *",
            [duenoEliminar]
        );

        if (!duenoAsignado.length) {
            throw new Error("El dueño a asignar no existe");
        }
        if (!duenoEliminado.length) {
            throw new Error("El dueño a eliminar no existe");
        }
        if (!nombresMascota.length) {
            throw new Error("El usuario no tiene mascotas o no existe.");
        }

        await client.query("COMMIT");

        return {
            duenoEliminado,
            duenoAsignado,
            mascotas: nombresMascota,
        };
    } catch (error) {
        await client.query("ROLLBACK");
        throw new Error(error.message);
    }
};

module.exports = {
    obtenerPersonaConMascota,
    obtenerTodasLasPersonas,
    agregarPersona,
    editarPersona,
    agregarPersonaConMascotas,
    eliminarDuenoYTransferirMascotas,
};
