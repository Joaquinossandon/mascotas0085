const db = require("../../db");
const {
    obtenerMascota,
    obtenerSexoMascotas,
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

module.exports = {
    obtenerMascotaPorId,
    obtenerInformacionMascotas,
};
