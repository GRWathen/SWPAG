const express = require("express");

const User = require("../models/user.js");
const { ensureCorrectUser } = require("../middleware/auth.js");

const router = express.Router();

router.get("/:username", ensureCorrectUser, async function (req, res, next) {
    try {
        const user = await User.get(req.params.username);
        return res.json({ user });
    } catch (err) {
        return next(err);
    }
});

router.post("/", ensureCorrectUser, async function (req, res, next) {
    try {
        delete req.body.token;

        const user = await User.register(req.body);
        let payload = {
            username: user.username
        };
        const token = jwt.sign(payload, SECRET);
        return res.status(201).json({ token });
    } catch (e) {
        return next(e);
    }
});

module.exports = router;
