const fs = require("fs");
const express = require("express");
const jwt = require("jsonwebtoken");

const router = new express.Router();

const db = require("../db");
const ExpressError = require("../expressError.js");
const { SECRET_KEY } = require("../config.js");

const PROVISIONAL_COUNT = 0;

router.get("/games", async (req, res, next) => {
    try {
        const games = await db.query(
            `SELECT c.category, ARRAY(
                SELECT CONCAT(game,'|',title) FROM games AS g
                WHERE c.id = g.category_id
                ORDER BY g.game
            )
            FROM categories AS c
            ORDER BY CASE
                WHEN c.category = 'Other'
                THEN 1 ELSE 0
            END, c.category ;`);
        return res.json(games.rows);
    }
    catch (err) {
        return next(err);
    }
})

/*/
{
    "Category": "<category>"
    "Game": "<game>"

    "Username": <username>
}
//*/
router.get("/engines", async (req, res, next) => {
    try {
        const engines = await db.query(
            `SELECT e.id, e.engine, e.rating, e.count, u.username
            FROM engines AS e
            INNER JOIN games AS g
            ON e.game_id = g.id
            INNER JOIN categories AS c
            ON g.category_id = c.id
            INNER JOIN users AS u
            ON e.user_id = u.id
            WHERE (c.category = '${req.query.Category}')
                AND (g.game = '${req.query.Game}')
                ${(req.query.Username === undefined) ? "" :
                `AND (u.username = '${req.query.Username}')`}
            ORDER BY e.id
            ;`
        );
        //ORDER BY u.username, e.engine
        return res.json(engines.rows);
    }
    catch (err) {
        return next(err);
    }
})

/*/
{
    "Category": "<category>"
    "Game": "<game>"
    "ID": "<id>"
}
//*/
router.get("/engine", async (req, res, next) => {
    try {
        let data = jwt.verify(req.query.token, SECRET_KEY);
        if (!data.hasOwnProperty("username") || (data.username !== req.query.Username)) {
            return res.send("ERROR");
        }
        const path = `${__dirname}/${req.query.Category}/${req.query.Game}/${req.query.ID}.js`;

        if (!fs.existsSync(path)) {
            await createEngine(path, req.query.ID);
        }

        data = fs.readFileSync(path, 'utf8')

        let firstIndex = data.indexOf("\n");
        firstIndex = data.indexOf("\n", firstIndex + 1);
        firstIndex = data.indexOf("\n", firstIndex + 1);
        let lastIndex = data.lastIndexOf("\n");
        lastIndex = data.lastIndexOf("\n", lastIndex - 1);

        return res.send(data.substring(firstIndex + 1, lastIndex));
    }
    catch (err) {
        return next(err);
    }
})

/*/
{
    "Game": "<game>"
    "Username": <username>
    "EngineCode": <code>
    "EngineName": <name>
}
//*/
router.post("/engine", async (req, res, next) => {
    try {
        let data = jwt.verify(req.body.params.token, SECRET_KEY);
        if (!data.hasOwnProperty("username") || (data.username !== req.body.params.Username)) {
            return res.send("ERROR");
        }
        let userID = await db.query(
            `SELECT u.id
            FROM users AS u
            WHERE u.username = '${req.body.params.Username}'
            ;`);
        userID = userID.rows[0]["id"];

        let gameID = await db.query(
            `SELECT g.id
            FROM games AS g
            WHERE g.game = '${req.body.params.Game}'
            ;`);
        gameID = gameID.rows[0]["id"];

        let engineID = await db.query(
            `SELECT e.id
            FROM engines AS e
            WHERE (e.engine = '${req.body.params.EngineName}')
                AND (e.game_id = '${gameID}')
                AND (e.user_id = '${userID}')
            ;`);

        const code = req.body.params.EngineCode;

        if ((engineID.rows.length > 0) && (engineID.rows[0].hasOwnProperty("id"))) {
            engineID = engineID.rows[0]["id"];
            await db.query(
                `UPDATE engines SET code = $1 WHERE id = $2`,
                [code, engineID]
            );
        }
        else {
            engineID = await db.query(
                `INSERT INTO engines (engine, game_id, user_id, code) VALUES ($1, $2, $3, $4) RETURNING id;`,
                [req.body.params.EngineName, gameID, userID, code]
            );
            engineID = engineID.rows[0]["id"];
        }
        const path = `${__dirname}/${req.body.params.Category}/${req.body.params.Game}/${engineID}.js`;

        const templateStart = "\"use strict\";\nmodule.exports = {\n  move: function (data) {\n";
        const templateEnd = "\n    }\n};";
        /*/
        "use strict";
        module.exports = {
            move: function (data) {
                // code
            }
        };
        //*/

        data = fs.writeFileSync(path, templateStart + code + templateEnd, 'utf8');

        return res.send("SEND");
    }
    catch (err) {
        return next(err);
    }
})

/*/
{
    "Username": <username>
    "EngineID": <id>
}
//*/
router.delete("/engine", async (req, res, next) => {
    try {
        let data = jwt.verify(req.query.token, SECRET_KEY);
        if (!data.hasOwnProperty("username") || (data.username !== req.query.Username)) {
            return res.send("ERROR");
        }
        const engineID = req.query.EngineID;

        let gameID = await db.query(
            `SELECT e.game_id
            FROM engines AS e
            WHERE e.id = '${engineID}'
            ;`);
        gameID = gameID.rows[0]["game_id"];

        let categoryID = await db.query(
            `SELECT g.game, g.category_id
            FROM games AS g
            WHERE g.id = '${gameID}'
            ;`);
        const gameName = categoryID.rows[0]["game"];
        categoryID = categoryID.rows[0]["category_id"];

        let categoryName = await db.query(
            `SELECT c.category
            FROM categories AS c
            WHERE c.id = '${categoryID}'
            ;`);
        categoryName = categoryName.rows[0]["category"];

        let result = await db.query(
            `DELETE
            FROM engines AS e
            WHERE e.id = '${engineID}'
            ;`);

        const path = `${__dirname}/${categoryName}/${gameName}/${engineID}.js`;
        data = fs.unlinkSync(path);

        return res.send("SEND");
    }
    catch (err) {
        return next(err);
    }
})

/*/
{
    "Category": "<category>"
    "Game": "<game>"
    "PlayerEngine": "<engine>"
    "Data": {
        // TTT(9) - 0:open, 1:current, 2;next
        // Checkers(32) - 0:open, 1/3:current, 2/4;next
        "Board": "[0,...,0]"
        ...
    }
}
//*/
// TODO: POST?
router.get("/move", async (req, res, next) => {
    try {
        const path = `${__dirname}/${req.query.Category}/${req.query.Game}/${req.query.PlayerEngine}.js`;

        if (!fs.existsSync(path)) {
            await createEngine(path, req.query.PlayerEngine);
        }

        delete require.cache[path];
        const engine = require(path);
        const data = JSON.parse(req.query.Data);
        // TODO: move() infinite loop or illegal move
        return res.json(await engine.move(data));
    }
    catch (err) {
        // TODO: lose
        return next(err);
    }
});

/*/
{
    "TopEngine": <topEngine>
    "BottomEngine": <bottomEngine>,
    "Result": <result>  // 0:Draw, 1:Top won, 2:Bottom won
}
//*/
// TODO: confirm rating updates
// TODO: zero/negative ratings?
// TODO: update to current ELO rating
router.post("/ratings", async (req, res, next) => {
    try {
        const top = req.body.params.TopEngine;
        const bottom = req.body.params.BottomEngine;
        const result = req.body.params.Result;

        let topRating = null;
        let topCount = null;
        const topResults = await db.query(
            `SELECT e.rating, e.count FROM engines AS e WHERE (e.id = '${top}');`
        );
        if (topResults.rows.length > 0) {
            if (topResults.rows[0].hasOwnProperty("rating")) {
                topRating = topResults.rows[0]["rating"];
            }
            else {
                return res.send("BAD TOP RATING");
            }
            if (topResults.rows[0].hasOwnProperty("count")) {
                topCount = topResults.rows[0]["count"];
            }
            else {
                return res.send("BAD TOP COUNT");
            }
        }
        else {
            return res.send("BAD TOP RESULTS");
        }

        let bottomRating = null;
        let bottomCount = null;
        const bottomResults = await db.query(
            `SELECT e.rating, e.count FROM engines AS e WHERE (e.id = '${bottom}');`
        );
        if (bottomResults.rows.length > 0) {
            if (bottomResults.rows[0].hasOwnProperty("rating")) {
                bottomRating = bottomResults.rows[0]["rating"];
            }
            else {
                return res.send("BAD BOTTOM RATING");
            }
            if (bottomResults.rows[0].hasOwnProperty("count")) {
                bottomCount = bottomResults.rows[0]["count"];
            }
            else {
                return res.send("BAD BOTTOM COUNT");
            }
        }
        else {
            return res.send("BAD BOTTOM RESULTS");
        }

        let diff = Math.abs(topRating - bottomRating);
        let points;
        switch (true) {
            case (diff < 8):
                points = 0;
                break;
            case (diff < 12):
                points = 1;
                break;
            case (diff < 17):
                points = 2;
                break;
            case (diff < 25):
                points = 3;
                break;
            case (diff < 35):
                points = 4;
                break;
            case (diff < 49):
                points = 5;
                break;
            case (diff < 69):
                points = 6;
                break;
            case (diff < 95):
                points = 7;
                break;
            case (diff < 129):
                points = 8;
                break;
            case (diff < 174):
                points = 9;
                break;
            case (diff < 232):
                points = 10;
                break;
            case (diff < 305):
                points = 11;
                break;
            case (diff < 395):
                points = 12;
                break;
            case (diff < 506):
                points = 13;
                break;
            case (diff < 640):
                points = 14;
                break;
            case (diff < 800):
                points = 15;
                break;
            default:
                points = 16;
                break;
        }

        let topChange = (0 + ((topRating > bottomRating) ? -points : points));
        let bottomChange = (0 + ((bottomRating > topRating) ? -points : points));
        if (result === 1) {
            topChange = (16 + ((topRating > bottomRating) ? -points : points));
            bottomChange = (-16 + ((bottomRating > topRating) ? -points : points));
        }
        else if (result === 2) {
            topChange = (-16 + ((topRating > bottomRating) ? -points : points));
            bottomChange = (16 + ((bottomRating > topRating) ? -points : points));
        }

        let topTotal = 0;
        if (topCount < PROVISIONAL_COUNT) {
            topTotal = (topRating * topCount) + bottomRating;
            topTotal += ((result === 0) ? 0 : (400 * ((result === 1) ? 1 : -1)));
        }
        let bottomTotal = 0;
        if (bottomCount < PROVISIONAL_COUNT) {
            bottomTotal = (bottomRating * bottomCount) + topRating;
            bottomTotal += ((result === 0) ? 0 : (400 * ((result === 2) ? 1 : -1)));
        }

        if (topCount < PROVISIONAL_COUNT) {
            topCount++;
            topRating = Math.trunc(topTotal / topCount);
        }
        else {
            topRating += topChange;
        }
        if (bottomCount < PROVISIONAL_COUNT) {
            bottomCount++;
            bottomRating = Math.trunc(bottomTotal / bottomCount);
        }
        else {
            bottomRating += bottomChange;
        }

        if (top !== bottom) {
            await db.query(
                `UPDATE engines SET rating = $1, count = $2 WHERE id = $3;`,
                [topRating, topCount, top]
            );
            await db.query(
                `UPDATE engines SET rating = $1, count = $2 WHERE id = $3;`,
                [bottomRating, bottomCount, bottom]
            );
        }

        return res.send("RATINGS OK");
    }
    catch (err) {
        return next(err);
    }
})

async function createEngine(path, engineID) {
    let code = await db.query(
        `SELECT e.code FROM engines AS e WHERE (e.id = '${engineID}');`);

    if ((code.rows.length > 0) && (code.rows[0].hasOwnProperty("code"))) {
        code = code.rows[0]["code"];

        const templateStart = "\"use strict\";\nmodule.exports = {\n  move: function (data) {\n";
        const templateEnd = "\n    }\n};";

        const data = fs.writeFileSync(path, templateStart + code + templateEnd, 'utf8');
    }

    return;
}

module.exports = router;
