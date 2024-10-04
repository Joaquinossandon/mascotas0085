const express = require("express");
const rutasPersonas = require("./src/routes/personas");
const rutasMascotas = require("./src/routes/mascotas");

const app = express();

app.use("/", rutasPersonas);
app.use("/", rutasMascotas);

app.listen(8000, () => {
    console.log("servidor ejecutandose en http://localhost:8000/");
});
