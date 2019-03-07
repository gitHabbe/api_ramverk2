const r   = require('express').Router();
const db        = require("../db/database.js");
const userTools = require("../src/user.js");
const bcrypt        = require('bcryptjs');
const saltRounds    = 10;
const jwt       = require('jsonwebtoken');

r.post("/test", (req, res) => {
    
    res.sendStatus(200);
});

module.exports = r;
