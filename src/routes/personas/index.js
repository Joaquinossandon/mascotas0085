const router = require("express").Router();
const controladorPersonas = require("../../controllers/personas");

router.get("/personas", controladorPersonas.obtenerTodosLosDuenos);
router.get("/personas/:id", controladorPersonas.obtenerDuenoPorId);

module.exports = router;
