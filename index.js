const express = require("express");
const db = require("./src/db/index");
const app = express();

app.get("/personas", async (req, res) => {
    const { rows, rowCount } = await db.query("SELECT nombre FROM duenos");

    res.status(200).json({
        count: rowCount,
        results: rows,
    });
});

app.get("/personas/:id", async (req, res) => {
    const { id } = req.params;

    // entrega de consulta como objeto
    const { rows: dueno } = await db.query({
        text: `SELECT * FROM duenos WHERE id = $1`,
        values: [id],
    });
    // entrega de consulta como parámetos
    // primer parámetro la consulta y segundo, los valores a insertar en la consulta
    const { rows: mascotas } = await db.query(
        `SELECT * FROM mascotas WHERE id_dueno = $1;`,
        [id]
    );

    res.status(200).json({
        result: { ...dueno[0], mascotas },
    });
});

app.get("/mascota/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const { rows } = await db.query(
            "select * from mascotas where id = $1",
            [id]
        );

        res.status(200).json({
            results: rows,
        });
    } catch (error) {
        res.status(200).json({
            results: [],
        });
    }
});

app.listen(8000, () => {
    console.log("servidor ejecutandose en http://localhost:8000/");
});
