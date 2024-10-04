const router = require("express").Router();
const controladorMascotas = require("../../controllers/mascotas");

router.get("/mascota/:id", controladorMascotas.obtenerMascotaPorId);

router.get("/mascotas/info", controladorMascotas.obtenerInformacionMascotas);

module.exports = router;
