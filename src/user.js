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
        sql  = "UPDATE user ";
        sql += "SET balance = balance - ? ";
        sql += "WHERE username = ?;";
		console.log('TCL: buyFigure -> sql', sql)
        db.run(sql, [(value * count).toFixed(2), username], (err, data) => {
            if (err) {
                reject(err);
            }
            sql  = "INSERT INTO figure2user ";
            sql += "(figure_name, user_username, count, value) ";
            sql += "VALUES (?, ?, ?, ?);";
            db.run(sql, [figure, username, count, value.toFixed(2)], (err, data) => {
                if (err) {
                    reject(err);
                }
                resolve(data);
            })
        })
    });
}

const sellFigure = (db, params) => {
    const [ value, username, count, figure ] = params;
    return new Promise((resolve, reject) => {
        let sql;
        sql  = "UPDATE user ";
        sql += "SET balance = balance + ? ";
        sql += "WHERE username = ?;";
		console.log('TCL: buyFigure -> sql', sql)
        db.run(sql, [(value * count.toFixed(2)), username], (err, data) => {
            if (err) {
                reject(err);
            }
            sql  = "INSERT INTO figure2user ";
            sql += "(figure_name, user_username, count, value) ";
            sql += "VALUES (?, ?, ?, ?);";
            db.run(sql, [figure, username, count, value.toFixed(2)], (err, data) => {
                if (err) {
                    reject(err);
                }
                resolve(data);
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
