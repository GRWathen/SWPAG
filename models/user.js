const bcrypt = require("bcrypt");

const ExpressError = require("../expressError.js");
const db = require("../db.js");
const { BCRYPT_WORK_FACTOR } = require("../config.js");

class User {
    static async authenticate(username, password) {
        console.log("models - authenticate");
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

    static async registerGet(username) {
        console.log("models - register (get)");
        const duplicateCheck = await db.query(
            `SELECT username FROM users WHERE username = $1`, [username]
        );
        if (duplicateCheck.rows[0]) {
            const error = new ExpressError(
                `There already exists a user with username ${username}`, 400
            );
            throw error;
        }
    }

    static async register({ username, password, email }) {
        console.log("models - register (post)");
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
            `INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING username;`,
            [username, hashedPassword, email]
        );
        return (result.rows[0]);
    }

    static async get(username) {
        console.log("models - get");
        const result = await db.query(
            `SELECT username FROM users WHERE username=$1;`,
            [username]
        );
        if (!result.rows[0]) {
            throw new ExpressError(`Invalid username: ${username}`, 404);
        }
        return (result.rows[0]);
    }

    static async getPassword(username) {
        console.log("models - getPassword");
        const result = await db.query(
            `SELECT password FROM users WHERE username=$1;`,
            [username]
        );
        if (!result.rows[0]) {
            throw new ExpressError(`Invalid username: ${username}`, 404);
        }
        return (result.rows[0]);
    }

    static async update(params) {
        console.log("models - update");
        const duplicateCheck = await db.query(
            `SELECT username FROM users WHERE username = $1`, [params.username]
        );
        if (duplicateCheck.rowCount < 1) {
            const error = new ExpressError(
                `Username not found: ${username}`, 400
            );
            throw error;
        }
        else if (duplicateCheck.rowCount > 1) {
            const error = new ExpressError(
                `Username error: ${duplicateCheck.rowCount}`, 400
            );
            throw error;
        }

        const password = await this.getPassword(params.username);
        const flag = await bcrypt.compare(params.password, password.password);
        if (!flag) {
            const error = new ExpressError(
                `Invalid Password`, 400
            );
            throw error;
        }

        let result = null;
        if (params.newpassword === "") {
            result = await db.query(
                `UPDATE users SET email = $2 WHERE username = $1 RETURNING username;`,
                [params.username, params.email]
            );
        }
        else {
            const hashedPassword = await bcrypt.hash(params.newpassword, BCRYPT_WORK_FACTOR);
            result = await db.query(
                `UPDATE users SET email = $2, password = $3 WHERE username = $1 RETURNING username;`,
                [params.username, params.email, hashedPassword]
            );
        }

        return (result.rows[0]);
    }
}

module.exports = User;
