const express   = require('express');
const router    = express.Router();
const db        = require("../db/database.js");
const userTools = require("../src/user.js");
// const bcrypt        = require('bcryptjs');
// const saltRounds    = 10;

router.post("/register", async (req, res) => {
    const { username, password, password2 } = req.body;
    let sql = "SELECT * FROM user WHERE email = ?";
    let creatable = true;
    const test = await userTools.isUsernameTaken(db, sql, [username]);
    if (test) {
        creatable = false;
    }
	console.log('TCL: test', test)
    // console.log('TCL: username, password, password2', username, password, password2);
    // await db.all(
    //     "SELECT * FROM user WHERE email = ?",
    //     [ username ],
    //     (err, data) => {
    //         if (err) {
	// 			console.log('TCL: err', err)
    //         } else {
    //             console.log("data", data);
    //             console.log("User found");
    //             creatable = false;
    //         }
    //     }
    // )
	console.log('TCL: creatable', creatable);

    // const hashedPassword = await bcrypt.hash(password, saltRounds);

    // db.run(
    //     "INSERT INTO users (email, password) VALUES (?, ?)",
    //     [ email, hashedPassword ], err => {
    //         console.log("IN DB");
    //         if (err) {
    //             console.log('​err', err)
    //         } else {
    //             console.log("user created");
    //         }
    // });

    return res.sendStatus(200);
    // return res.redirect("/");
});


module.exports = router;
