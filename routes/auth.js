const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const ExpressError = require("../expressError.js");
const db = require("../db.js");
const User = require("../models/user.js");

const { BCRYPT_WORK_FACTOR, SECRET_KEY } = require("../config.js");
// TODO: const { ensureLoggedIn } = require("../middleware/auth.js");

const router = new express.Router();

router.get("/register", async (req, res, next) => {
    console.log("auth - register (get)");
    try {
        if (!req.query.username) {
            throw new ExpressError(`Username required`, 400);
        }
        await User.registerGet(req.query.username);
        return res.json({ "token": null });
    }
    catch (err) {
        if (err.code === "23505") {
            return next(new ExpressError(`Username taken`, 400));
        }
        return next(err);
    }
});

router.patch("/register", async (req, res, next) => {
    console.log("auth - register (patch)");
    try {
        if (!req.body.params.username) {
            throw new ExpressError(`Username required`, 400);
        }
        await User.get(req.body.params.username);
        return res.json({ "token": null });
    }
    catch (err) {
        //if (err.code === "23505") {
            //return next(new ExpressError(`Username error`, 400));
        //}
        return next(err);
    }
});

router.put("/register", async (req, res, next) => {
    console.log("auth - register (put)");
    try {
        if (!req.body.params.username) {
            throw new ExpressError(`Username required`, 400);
        }
        if (!req.body.params.password) {
            throw new ExpressError(`Password required`, 400);
        }
        if (!req.body.params.email) {
            throw new ExpressError(`Email required`, 400);
        }
        await User.update(req.body.params);
        return res.json({ "token": null });
    }
    catch (err) {
        return next(err);
    }
});

router.post("/register", async (req, res, next) => {
    console.log("auth - register (post)");
    try {
        if (!req.body.username || !req.body.password) {
            throw new ExpressError(`Username/Password required`, 400);
        }
        if (!req.body.email) {
            throw new ExpressError(`Email required`, 400);
        }
        const { username } = await User.register(req.body);
        const token = jwt.sign({ username }, SECRET_KEY);
        return res.json({ "token": token });
    }
    catch (err) {
        if (err.code === "23505") {
            return next(new ExpressError(`Username taken`, 400));
        }
        return next(err);
    }
});

router.post("/login", async (req, res, next) => {
    console.log("auth - login");
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            throw new ExpressError(`Username/Password required`, 400);
        }
        if (await User.authenticate(username, password)) {
            const token = jwt.sign({ username }, SECRET_KEY);
            return res.json({ "token": token });
        }
        else {
            throw new ExpressError("Invalid username/password", 400);
        }
    }
    catch (err) {
        return next(err);
    }
});

/*/
router.get("/secret", ensureLoggedIn, function (req, res, next) {
    try {
        const token = req.body.token;
        const data = jwt.verify(token, SECRET_KEY)

        return res.json({ message: "Logged in" });
    }
    catch (err) {
        return next(new ExpressError("Not logged in", 401));
    }
});
//*/

module.exports = router;
