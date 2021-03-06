const express       = require("express");
const morgan        = require('morgan');
const cors          = require('cors');
const bodyParser    = require("body-parser");
const indexRoute         = require("./routes/index.js");
const userRoute         = require("./routes/user.js");
const figureRoute         = require("./routes/figure.js");

const app = express();

const port = 7333;

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded(
    { extended: true }
)); // for parsing application/x-www-form-urlencoded

app.use(cors());

// don't show the log when it is test
if (process.env.NODE_ENV !== 'test') {
    // use morgan to log at command line
    app.use(morgan('combined')); // 'combined' outputs the Apache style LOGs
}

app.use('/', indexRoute);
app.use('/user', userRoute);
app.use('/figure', figureRoute);


// Add routes for 404 and error handling
// Catch 404 and forward to error handler
// Put this last
app.use((req, res, next) => {
    var err = new Error("Not Found");
    err.status = 404;
    next(err);
});


app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    return res.status(err.status || 500).json({
        "errors": [
            {
                "status": err.status,
                "title":  err.message,
                "detail": err.message
            }
        ]
    });
    // return res.sendStatus(400);
});
let server;
if (process.env.NODE_ENV === 'test') {
    server = app;
}
else {
    server = app.listen(port, () => console.log(`Example API listening on port ${port}!`));
}

module.exports = server;
