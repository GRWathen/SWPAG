const bcrypt = require("bcrypt");

const ExpressError = require("../expressError.js");
const db = require("../db.js");
const { BCRYPT_WORK_FACTOR } = require("../config.js");

class User {
    static async authenticate(username, password) {
        const result = await db.query(
            `SELECT password FROM users WHERE username=$1;`,
            [username]
        );
        const user = result.rows[0];
        if (user) {
            return (await bcrypt.compare(password, user.password));
        }
        return (false);
    }

    static async register({ username, password }) {
        const duplicateCheck = await db.query(
            `SELECT username FROM users WHERE username = $1`, [username]
        );
        if (duplicateCheck.rows[0]) {
            const error = new ExpressError(
                `There already exists a user with username ${username}`, 400
            );
            throw error;
        }

        const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
        const result = await db.query(
            `INSERT INTO users (username, password) VALUES ($1, $2) RETURNING username;`,
            [username, hashedPassword]
        );
        return (result.rows[0]);
    }

    static async get(username) {
        const result = await db.query(
            `SELECT username FROM users WHERE username=$1;`,
            [username]
        );
        if (!result.rows[0]) {
            throw new ExpressError(`Invalid username: ${username}`, 404);
        }
        return (result.rows[0]);
    }
}

module.exports = User;
