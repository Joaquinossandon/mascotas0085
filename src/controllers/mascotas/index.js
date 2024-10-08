const db = require("../../db");
const {
    obtenerMascota,
    obtenerSexoMascotas,
    obtenerTodasLasMascotas,
    agregarMascota,
    editarMascota,
} = require("../../models/mascotas");

const obtenerMascotaPorId = async (req, res) => {
    const { id } = req.params;
    try {
        const results = await obtenerMascota(id);

        res.status(200).json({
            results,
        });
    } catch (error) {
        if (error.code === "22P02") {
            res.status(200).json({
                results: [],
                error: error,
            });
            return;
        }
        res.status(200).json({
            results: [],
            error: error,
        });
    }
};

const obtenerInformacionMascotas = async (req, res) => {
    const cursor = await obtenerSexoMascotas();

    let resultado = await cursor.read(10);

    let infoSexo = {
        Masculinos: 0,
        Femeninos: 0,
    };

    while (resultado.length) {
        resultado.forEach((mascota) => {
            if (mascota.sexo === "M") {
                infoSexo.Masculinos += 1;
            } else {
                infoSexo.Femeninos += 1;
            }
        });
        resultado = await cursor.read(10);
    }

    cursor.close(() => {
        client.release();
        console.log("El cursor ha sido cerrado");
    });

    res.json(infoSexo);
};

const obtenerTodasMascotas = async (req, res) => {
    const mascotas = await obtenerTodasLasMascotas();
    res.status(200).json(mascotas);
};

const agregarUnaMascota = async (req, res) => {
    try {
        const { id_dueno, nombre, especie, raza, fecha_nacimiento, sexo } =
            req.body;
        const nuevaMascota = {
            id_dueno,
            nombre,
            especie,
            raza,
            fecha_nacimiento,
            sexo,
        };
        const { rows } = await agregarMascota(nuevaMascota);

        res.status(200).json(rows);
    } catch (err) {
        // se debe controlar dependiendo del codigo del error 👀
        res.status(400).json({
            err: "Algo ocurrió",
            error: err,
        });
    }
};

const EditarMascota = async (req, res) => {
    try {
        // /mascotas/:id
        const { id } = req.params;
        const { id_dueno, nombre, raza, especie, fecha_nacimiento, sexo } =
            req.body;
        const mascotaEditada = {
            id,
            id_dueno,
            nombre,
            raza,
            especie,
            fecha_nacimiento,
            sexo,
        };

        const { rows } = await editarMascota(mascotaEditada);

        res.status(200).json(rows);
    } catch (error) {
        res.status(400).json({
            err: "Algo ocurrió",
            error,
        });
    }
};

module.exports = {
    obtenerMascotaPorId,
    obtenerInformacionMascotas,
    obtenerTodasMascotas,
    agregarUnaMascota,
    EditarMascota,
};
