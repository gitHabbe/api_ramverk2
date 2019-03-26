const jwt       = require('jsonwebtoken');

const getQuery = (db, sql, params) => {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, data) => {
            if (err) {
                reject(err);
            }
            resolve(data);
        });
    });
}

const getAllQuery = (db, sql, params) => {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, data) => {
            if (err) {
                reject(err);
            }
            resolve(data);
        });
    });
}

const runQuery = (db, sql, params) => {
    return new Promise((resolve, reject) => {
        db.run(sql, params, (err, data) => {
            if (err) {
                reject(err);
            }
            resolve(data);
        });
    });
}

const buyFigure = (db, params) => {
    const [ value, username, count, figure ] = params;
    return new Promise((resolve, reject) => {
        let sql;
        sql  = "SELECT * ";
        sql += "FROM figure2user ";
        sql += "WHERE user_username = ? ";
        sql += "AND figure_name = ?; ";
        db.get(sql, [username, figure], (err, data) => {
            if (err) {
                reject(err);
            }
            if (data) {
                sql  = "UPDATE figure2user ";
                sql += "SET count = count + ? ";
                sql += "WHERE user_username = ? ";
                sql += "AND figure_name = ?;";
            } else {
                sql  = "INSERT INTO figure2user ";
                sql += "(count, user_username, figure_name) ";
                sql += "VALUES (?, ?, ?);";
            }
            db.run(sql, [count, username, figure], (err, data) => {
                if (err) {
                    reject(err);
                }
                sql  = "UPDATE user ";
                sql += "SET balance = balance - ? ";
                sql += "WHERE username = ?;";
                db.run(sql, [(count * value).toFixed(2), username], (err, data) => {
                    if (err) {
                        reject(err);
                    }
                    sql  = "INSERT INTO tradeEvent ";
                    sql += "(figure_name, user_username, count, value, tradeType) ";
                    sql += "VALUES (?, ?, ?, ?, ?);";
                    db.run(sql, [figure, username, count, value, "BUY"], (err, data) => {
                        if (err) {
                            reject(err);
                        }
                        resolve(data);
                    })
                })
            })
        });
    });
}

const sellFigure = (db, params) => {
    const [ value, username, count, figure ] = params;
	// console.log("TCL: sellFigure -> count", typeof count);
    return new Promise((resolve, reject) => {
        let sql;
        sql  = "UPDATE user ";
        sql += "SET balance = balance + ? ";
        sql += "WHERE username = ?;";
		console.log('TCL: buyFigure -> sql', sql)
        db.run(sql, [(value * count).toFixed(2), username], (err, data) => {
            if (err) {
                reject(err);
            }
            sql  = "UPDATE figure2user ";
            sql += "SET count = count - ? ";
            sql += "WHERE user_username = ? ";
            sql += "AND figure_name = ?;";
            db.run(sql, [count, username, figure], (err, data) => {
                if (err) {
                    reject(err);
                }
                sql  = "INSERT INTO tradeEvent ";
                sql += "(figure_name, user_username, count, value, tradeType) ";
                sql += "VALUES (?, ?, ?, ?, ?);";
                db.run(sql, [figure, username, count, value, "SELL"], (err, data) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(data);
                })
            })
        })
    });
}

const checkToken = (req, res, next) => {
    const token = req.headers['x-access-token'] || req.headers['authorization'];
	console.log('TCL: checkToken -> token', token);

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.sendStatus(403);
        }
        res.token = token;
        res.user = decoded;
        next();
    });
}

const verifyToken = (jwt, token) => {
    return jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return { token: false, user: false };
        }

        return { token, user: decoded };
    });
}



module.exports = {
    getQuery,
    runQuery,
    checkToken,
    buyFigure,
    verifyToken,
    getAllQuery,
    sellFigure
};
