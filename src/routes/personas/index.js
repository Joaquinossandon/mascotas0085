const router = require("express").Router();
const controladorPersonas = require("../../controllers/personas");

router.get("/personas", controladorPersonas.obtenerTodosLosDuenos);
router.get("/personas/:id", controladorPersonas.obtenerDuenoPorId);
router.post("/personas", controladorPersonas.AgregarPersona);
router.put("/personas/:id", controladorPersonas.EditarPersona);
router.post("/persona/mascotas", controladorPersonas.AgregarPersonaConMascotas);

module.exports = router;
