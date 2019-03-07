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

const checkToken = (req, res, next) => {
    const token = req.headers['x-access-token'] || req.headers['authorization'];
	console.log('TCL: checkToken -> token', token);

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.sendStatus(403);
        }
        res.token = token;
        res.json({'token': token, username: decoded.username});
        
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
    verifyToken
};
