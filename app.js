//---------- express application ----------
const express = require("express");
//const nunjucks = require("nunjucks");
//const morgan = require("morgan");
//const helmet = require("helmet");
const cors = require("cors");

const ExpressError = require("./expressError.js")
const db = require("./db.js");
const { authenticateJWT } = require("./middleware/auth.js");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});
//app.use(morgan("dev")); // tiny
//app.use(helmet());

/*/
nunjucks.configure("templates", {
    autoescape: true,
    express: app
});
//*/

app.get("/favicon.ico", (req, res, next) => {
    console.log("Favicon");
    return res.sendStatus(204);
});

//---------- routes - /api ----------
const apiRoutes = require("./api/api.js");
app.use("/api", apiRoutes);

//---------- routes - /auth ----------
const auth = require("./routes/auth.js");
app.use("/", auth);

//---------- routes - generic ----------
app.get("/", (req, res, next) => {
    console.log("Homepage");
    //return res.render("home.html", { title });
    //return res.redirect("page.html");
    return res.send("homepage");
    //return res.json("json");
});

//---------- routes - specific ----------
app.get("/route", (req, res, next) => {
    console.log("Route");
    return res.send("Route");
});

app.use(authenticateJWT);

//---------- routes - /users ----------
const users = require("./routes/users.js");
app.use("/users", users);

//---------- 404 handler ----------
app.use((req, res, next) => {
    console.log("404 Not Found");
    const err = new ExpressError("Not Found", 404);
    return next(err)
});

//---------- generic error handler ----------
app.use((err, req, res, next) => {
    console.log("Error Handler");
    const status = err.status || 500;
    const message = err.message;
    //*/
    console.log({
        "error": { message, status }
    });
    //*/

    return res.status(status).json({
        "error": { message, status }
    });
});

module.exports = app;
