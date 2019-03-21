const r   = require('express').Router();
const db        = require("../db/database.js");
const userTools = require("../src/user.js");
// const bcrypt        = require('bcryptjs');
// const saltRounds    = 10;
// const jwt       = require('jsonwebtoken');

r.get("/figures", async (req, res) => {
    let sql = "SELECT * FROM figure;";
    const figures = await userTools.getAllQuery(db, sql, []);

    return res.status(200).send(figures);
});

module.exports = r;
