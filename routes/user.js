const express   = require('express');
const router    = express.Router();
const db        = require("../db/database.js");
const userTools = require("../src/user.js");
const bcrypt        = require('bcryptjs');
const saltRounds    = 10;
const jwt       = require('jsonwebtoken');

router.post("/register", async (req, res) => {
    const { username, password, password2 } = req.body;

    if (password !== password2) {
        return res.sendStatus(422)
    }
    const sql = "SELECT * FROM user WHERE username = ?;";
    const user = await userTools.getQuery(db, sql, [username]);

    if (user) {
        return res.sendStatus(409);
    }


    const hashedPassword = await bcrypt.hash(password, saltRounds);

    db.run(
        "INSERT INTO user (username, password) VALUES (?, ?)",
        [ username, hashedPassword ],
        err => {
            if (err) {
                console.log('​err', err)
            } else {
                console.log("user created");
            }
    });
    
    return res.sendStatus(201);
});

router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    let sql = "SELECT * FROM user WHERE username = ?;";
    const user = await userTools.getQuery(db, sql, [username]);
    if (!user) {
        return res.sendStatus(404);
    }
    const isCorrectPass = await bcrypt.compare(password, user.password);
    if (!isCorrectPass) {
        return res.sendStatus(401);
    }
    const payload = { "username": username };
    const secret = process.env.JWT_SECRET;
    const token = jwt.sign(payload, secret, { expiresIn: '1m'});
    // res.userInfo = { "username": username, "token": token };
    
    return res.status(200).send({token, user: user});

});


module.exports = router;
