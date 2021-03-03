const { Client } = require("pg");
const { DB_URI } = require("./config");
//const { getDatabaseUri } = require("./config");

let db;
console.log(DB_URI);
if (DB_URI.startsWith("swpagDB")) {
    db = new Client({
        connectionString: DB_URI
        //connectionString: getDatabaseUri(),
    });
}
else {
    db = new Client({
        connectionString: DB_URI,
        //connectionString: getDatabaseUri(),
        ssl: {
            rejectUnauthorized: false,
        },
    });
}
//const db = new Client(process.env.DATABASE_URL || "postgresql:///swpagDB");

db.connect();

module.exports = db;
