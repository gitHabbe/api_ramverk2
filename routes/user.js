const express   = require('express');
const router    = express.Router();
const db        = require("../db/database.js");
const userTools = require("../src/user.js");
const bcrypt        = require('bcryptjs');
const saltRounds    = 10;
const jwt       = require('jsonwebtoken');
const { checkToken } = require("../src/user.js");


router.post("/register", async (req, res) => {
    const { username, password, password2 } = req.body;
    let sql, user;

    if (password !== password2) {
        return res.sendStatus(422)
    }
    sql = "SELECT * FROM user WHERE username = ?;";
    user = await userTools.getQuery(db, sql, [username]);

    if (user) {
        return res.sendStatus(409);
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    sql = "INSERT INTO user (username, password) VALUES (?, ?);";
    user = await userTools.runQuery(db, sql, [username, hashedPassword]); 
    
    return res.sendStatus(201);
});

router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    let sql = "SELECT * FROM user WHERE username = ?;";
    const user = await userTools.getQuery(db, sql, [username]);
	console.log('TCL: user', user)
    if (!user) {
        return res.sendStatus(404);
    }
    const isCorrectPass = await bcrypt.compare(password, user.password);
    if (!isCorrectPass) {
        return res.sendStatus(401);
    }
    const payload = { "username": user.username, "balance": user.balance };
    const secret = process.env.JWT_SECRET;
    const token = jwt.sign(payload, secret, { expiresIn: '1h'});
    // res.userInfo = { "username": username, "token": token };
    
    return res.status(200).send({ token, user });
});

router.post("/token", async (req, res) => {
    const { token } = req.body;
    const test = await userTools.verifyToken(jwt, token);

    return res.status(200).send(test);
});

router.post("/buy", checkToken, async (req, res) => {
    const { user, figure, count } = req.body;
    const params = [
        figure.value,
        user.data.user.username,
        count,
        figure.name
    ];
    console.log("/BUY ROUTE");
    if (user.data.user.balance < figure.value * count) {
        console.log("Too LOW balance");
        return res.sendStatus(400);
    } else {
        const test = await userTools.buyFigure(db, params);
		console.log('TCL: test', test)
        return res.sendStatus(200);
    }
});

router.post("/sell", checkToken, async (req, res) => {
    const { user, figure, count } = req.body;
    const params = [
        figure.value,
        user.data.user.username,
        count,
        figure.name
    ];
    console.log("user: ", user);
    let sql = `SELECT * FROM userFigureCount WHERE user_username = ?;`;
    const userInfo = await userTools.getAllQuery(db, sql, user.data.user.username);
	console.log("TCL: userInfo", userInfo);
    console.log("/SELL ROUTE");
    console.log("figure: ", figure);
    let correctFigure = userInfo.find(figuree => figuree.figure_name === figure.name);
    console.log("TCL: correctFigure", correctFigure);
    if (correctFigure.COUNT <= count) {
        return res.sendStatus(400);
    }
    // if (user) {
        
    // }

    // if (user.data.user.balance < figure.value * count) {
    //     console.log("Too LOW balance");
    //     return res.sendStatus(400);
    // } else {
    //     const test = await userTools.buyFigure(db, params);
	// 	console.log('TCL: test', test)
    // }
    return res.sendStatus(200);

});

router.post("/get-user", checkToken, async (req, res) => {
    const { username } = req.body.user.data.user;
    let sql = `SELECT * FROM user WHERE username = ?;`;
    const user = await userTools.getQuery(db, sql, [username]);

    return res.status(200).send({user});
    
    
})

router.get("/purchases", checkToken, async (req, res) => {
    console.log("res.user: ", res.user);
    let sql = `SELECT * FROM figure2user WHERE user_username = ?;`;
    const rows = await userTools.getAllQuery(db, sql, [res.user.username]);

    return res.status(200).send({rows});
})

module.exports = router;
