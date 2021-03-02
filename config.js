require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY || "swpag";

const PORT = +process.env.PORT || 3001;

const BCRYPT_WORK_FACTOR = 12;

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";

// database is:
//
// - on Heroku, get from env var DATABASE_URL
// - in testing, 'swpag-test'
// - else: 'swpag'

const DB_URI = (process.env.NODE_ENV === "test")
    ? "postgresql:///swpagDB-test"
    : process.env.DATABASE_URL || "postgresql:///swpagDB";
    //: getDatabaseUri() || "postgresql:///swpagDB";

console.log("Using database", DB_URI);

module.exports = {
    SECRET_KEY,
    PORT,
    BCRYPT_WORK_FACTOR,
    BASE_URL,
    DB_URI
};
