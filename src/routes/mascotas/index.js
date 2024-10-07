const router = require("express").Router();
const controladorMascotas = require("../../controllers/mascotas");

router.get("/mascota/:id", controladorMascotas.obtenerMascotaPorId);

router.get("/mascotas/info", controladorMascotas.obtenerInformacionMascotas);

router.get('/mascotas', controladorMascotas.obtenerTodasMascotas)

module.exports = router;


// TAREA: Generar una ruta que nos traiga todas las mascotas en nuestra base de datos
// tareas:
// - armar la ruta
// - armar el modelo
// - armar el controlador