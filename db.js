const { Client } = require("pg");
const { DB_URI } = require("./config");

const db = new Client({
    connectionString: DB_URI
});
//const db = new Client(process.env.DATABASE_URL || "postgresql:///swpagDB");

db.connect();

module.exports = db;
