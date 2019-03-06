const isUsernameTaken = (db, sql, params) => {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, data) => {
            if (err) {
                reject(err);
            }
            resolve(data);
        })
    })
}

module.exports = {
    isUsernameTaken
};
