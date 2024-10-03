const pg = require("pg");
const { Pool } = pg;

const pool = new Pool({
    user: "postgres",
    password: "admin123",
    host: "localhost",
    port: "5433",
    database: "mascotas",
});

module.exports = pool;
