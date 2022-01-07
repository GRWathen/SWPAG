const jwt = require("jsonwebtoken");

const ExpressError = require("../expressError.js");
const { SECRET_KEY } = require("../config.js");

function authenticateJWT(req, res, next) {
    console.log("middleware - authenticateJWT");
    try {
        const token = req.query.token;
        const data = jwt.verify(token, SECRET_KEY);
        req.user = data;
        return next();
    }
    catch (err) {
        err = new ExpressError("Unauthenticated", 401);
        return next(err);
    }
}

function ensureLoggedIn(req, res, next) {
    console.log("middleware - ensureLoggedIn");
    if (!req.user) {
        const err = new ExpressError("Unauthorized", 401);
        return next(err);
    }
    else {
        return next();
    }
}

function ensureCorrectUser(req, res, next) {
    console.log("middleware - ensureCorrectUser");
    try {
        if (req.user.username === req.params.username) {
            return next();
        } else {
            const err = new ExpressError("Unauthorized", 401);
            return next(err);
        }
    }
    catch (err) {
        err = new ExpressError("Unauthorized", 401);
        return next(err);
    }
}

module.exports = { authenticateJWT, ensureLoggedIn, ensureCorrectUser };
